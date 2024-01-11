import * as controllerImports from "./_index";
import { Request } from "express";

const { prisma, customError, fns } = controllerImports;

export default class goalController {
	//----------------------GET-ALL
	static async getAll() {
		const icons = await prisma.categories_icons.findMany({
			select: {
				id: true,
				icon_name: true,
			},
		});

		return icons;
	}

	//----------------------GET-ID
	static async getId(id: number) {
		if (isNaN(id)) {
			throw customError({ message: "o id inserido é inválido!" });
		}
		const icon = await prisma.categories_icons.findFirst({
			select: {
				id: true,
				icon_name: true,
			},
			where: {
				id: id,
			},
		});
		if (icon === null) {
			throw customError({ status: 404, message: "ícone não encontrado!" });
		}
		return icon;
	}

	//----------------------CREATE
	static async create(req: Request, access_level: number) {
		if (access_level < 3) {
			throw customError({
				status: 403,
				message: "você não tem permissão suficiente para fazer essa requisição!",
			});
		}

		const { icon_name } = req.body;

		const result = await prisma.categories_icons.create({
			data: { icon_name },
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

		const { icon_name } = req.body;

		const result = await prisma.categories_icons.update({
			data: { icon_name },
			where: {
				id: id,
			},
		});
		return result;
	}

	//----------------------DELETE
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

		const result = await prisma.goals.delete({
			where: {
				id: id,
			},
		});
		return result;
	}
}
