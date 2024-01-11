import * as controllerImports from "./_index";
import { Request } from "express";

const { prisma, customError } = controllerImports;

export default class categoryController {
	//----------------------GET-ALL
	static async getAll(user_id: number) {
		const categories = await prisma.categories.findMany({
			select: {
				id: true,
				name: true,
				icon_id: true,
				categories_icons: { select: { icon_name: true } },
				user_id: true,
			},
			where: {
				user_id: {
					in: [user_id, -1],
				},
			},
		});

		return categories;
	}

	//----------------------GET-ID
	static async getId(id: number, user_id: number) {
		if (isNaN(id)) {
			throw customError({ message: "o id inserido é inválido!" });
		}

		const category = await prisma.categories.findFirst({
			select: {
				id: true,
				name: true,
				icon_id: true,
				categories_icons: { select: { icon_name: true } },
				user_id: true,
			},
			where: {
				id: id,
				user_id: {
					in: [user_id, -1],
				},
			},
		});
		if (category === null) {
			throw customError({ status: 404, message: "categoria não encontrada!" });
		}
		return category;
	}

	//----------------------CREATE
	static async create(req: Request, user_id: number) {
		const { name, icon_id } = req.body;

		if (typeof icon_id !== "number") {
			throw customError({ message: "o ícone informado é inválido" });
		}

		const result = await prisma.categories.create({
			data: { name, icon_id, user_id },
		});
		return result;
	}

	//----------------------UPDATE
	static async update(req: Request, id: number, user_id: number) {
		if (isNaN(id) || id < 0) {
			throw customError({
				message: "o id inserido é inválido!",
			});
		}

		const { name, icon_id } = req.body;

		if (typeof icon_id !== "number") {
			throw customError({ message: "o ícone informado é inválido" });
		}

		const result = await prisma.categories.update({
			data: { name, icon_id, user_id },
			where: {
				id: id,
				user_id: user_id,
			},
		});
		return result;
	}

	//----------------------DELETE
	static async delete(id: number, user_id: number) {
		if (isNaN(id) || id <= 1) {
			throw customError({
				message: "o id inserido é inválido!",
			});
		}

		await prisma.transactions
			.updateMany({
				data: { categorie_id: 1 },
				where: { categorie_id: id },
			})
			.catch();

		const result = await prisma.categories.delete({
			where: {
				id: id,
				user_id: user_id,
			},
		});

		return result;
	}
}
