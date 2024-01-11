import * as controllerImports from "./_index";
import { Request } from "express";

const { prisma, customError, fns } = controllerImports;

export default class goalController {
	//----------------------GET-ALL
	static async getAll() {
		const methods = await prisma.payment_methods.findMany({
			select: {
				id: true,
				method_name: true,
			},
		});

		return methods;
	}

	//----------------------GET-ID
	static async getId(id: number) {
		if (isNaN(id)) {
			throw customError({ message: "o id inserido é inválido!" });
		}
		const method = await prisma.payment_methods.findFirst({
			select: {
				id: true,
				method_name: true,
			},
			where: {
				id: id,
			},
		});
		if (method === null) {
			throw customError({ status: 404, message: "metodo não encontrado!" });
		}
		return method;
	}

	//----------------------CREATE
	static async create(req: Request, access_level: number) {
		if (access_level < 3) {
			throw customError({
				status: 403,
				message: "você não tem permissão suficiente para fazer essa requisição!",
			});
		}

		const { method_name } = req.body;

		const result = await prisma.payment_methods.create({
			data: { method_name },
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

		const { method_name } = req.body;

		const result = await prisma.payment_methods.update({
			data: { method_name },
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

		const result = await prisma.payment_methods.delete({
			where: {
				id: id,
			},
		});
		return result;
	}
}
