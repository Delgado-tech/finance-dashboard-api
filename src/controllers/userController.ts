import * as controllerImports from "./index";
import { Request } from "express";

const { prisma, bcrypt, customError, validator } = controllerImports;

export default class userController {
	//----------------------GET-ALL
	static async getAll(access_level: number) {
		const showAccessLevel = access_level > 2;

		const users = await prisma.users.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				access_level_id: showAccessLevel,
				created_at: true,
				updated_at: true,
			},
			where: {
				id: {
					gt: 0,
				},
			},
		});

		return users;
	}

	//----------------------GET-ID
	static async getId(id: number, access_level: number) {
		if (isNaN(id) || id < 0) {
			throw customError({ message: "o id inserido é inválido!" });
		}

		const showAccessLevel = access_level > 2;

		const user = await prisma.users.findFirst({
			select: {
				id: true,
				name: true,
				email: true,
				access_level_id: showAccessLevel,
				created_at: true,
				updated_at: true,
			},
			where: { id: id },
		});

		if (user === null) {
			throw customError({ status: 404, message: "usuário não encontrado!" });
		}

		return user;
	}

	//----------------------CREATE
	static async create(req: Request, access_level: number) {
		if (access_level < 3) {
			throw customError({
				status: 403,
				message: "você não tem permissão suficiente para fazer essa requisição!",
			});
		}

		const { name, email, password } = req.body;

		const isValidEmail = validator.isEmail(email);
		if (!isValidEmail) {
			throw customError({
				message: "o e-mail informado não é valido!",
			});
		}

		// criptografia da senha
		const salts = 10;
		const cryptedPassoword = await bcrypt.hash(password, salts);

		const result = await prisma.users.create({
			data: { name, email, password: cryptedPassoword },
		});

		return result;
	}

	//----------------------UPDATE
	static async update(req: Request, id: number, access_level: number) {
		if (access_level < 3) {
			throw customError({
				status: 403,
				message: "você não tem permissão suficiente para fazer essa requisição!",
			});
		}

		if (isNaN(id) || id < 0) {
			throw customError({
				message: "o id inserido é inválido!",
			});
		}

		const { name, email, password, access_level_id } = req.body;

		if (access_level <= access_level_id && access_level < 4) {
			throw customError({
				status: 403,
				message:
					"você não tem permissão suficiente para atribuir esse nível de acesso a esse usuário!",
			});
		}

		const user = await this.getId(id, access_level);

		if (user.access_level_id >= access_level && access_level < 4) {
			throw customError({
				status: 403,
				message: "você não tem permissão para modificar esse usuário!",
			});
		}

		if (email) {
			const isValidEmail = validator.isEmail(email);
			if (!isValidEmail) {
				throw customError({
					message: "o e-mail informado não é valido!",
				});
			}
		}

		const salts = 10;

		const cryptedPassoword = password
			? await bcrypt.hash(password, salts)
			: undefined;

		const result = await prisma.users.update({
			data: {
				name,
				email,
				password: cryptedPassoword,
				access_level_id,
				updated_at: new Date(),
			},
			where: { id: id },
		});

		return result;
	}

	static async delete(id: number, access_level: number) {
		if (access_level < 3) {
			throw customError({
				status: 403,
				message: "você não tem permissão suficiente para fazer essa requisição!",
			});
		}

		if (isNaN(id) || id < 0) {
			throw customError({
				message: "o id inserido é inválido!",
			});
		}

		const user = await this.getId(id, access_level);

		if (user.access_level_id >= access_level && access_level < 4) {
			throw customError({
				status: 403,
				message: "você não tem permissão para excluir esse usuário!",
			});
		}

		const result = await prisma.users.delete({ where: { id: id } });

		return result;
	}
}
