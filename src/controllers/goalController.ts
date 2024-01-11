import * as controllerImports from "./_index";
import { Request } from "express";

const { prisma, customError, fns } = controllerImports;

export default class goalController {
	//----------------------GET-ALL
	static async getAll(user_id: number) {
		const categories = await prisma.goals.findMany({
			select: {
				id: true,
				date_value: true,
				value: true,
				user_id: true,
			},
			where: {
				user_id: user_id,
			},
		});
		return categories;
	}

	//----------------------GET-ID
	static async getId(id: number, user_id: number) {
		if (isNaN(id)) {
			throw customError({ message: "o id inserido é inválido!" });
		}
		const category = await prisma.goals.findFirst({
			select: {
				id: true,
				date_value: true,
				value: true,
				user_id: true,
			},
			where: {
				id: id,
				user_id: user_id,
			},
		});
		if (category === null) {
			throw customError({ status: 404, message: "meta não encontrada!" });
		}
		return category;
	}

	//----------------------CREATE
	static async create(req: Request, user_id: number) {
		const { value, date } = req.body;

		if (typeof value !== "number") {
			throw customError({ message: "o valor da meta é inválido" });
		}

		const formatedDate = new Date(fns.formatISO(date));

		const isValidDate = fns.isValid(formatedDate);

		if (!isValidDate) {
			throw customError({ message: "a data informada é inválida" });
		}

		const result = await prisma.goals.create({
			data: { value, date_value: formatedDate, user_id },
		});
		return result;
	}

	//----------------------UPDATE
	static async update(req: Request, id: number, user_id: number) {
		const { value, date } = req.body;

		if (typeof value !== "number") {
			throw customError({ message: "o valor da meta é inválido" });
		}

		const formatedDate = new Date(fns.formatISO(date));

		const isValidDate = fns.isValid(formatedDate);

		if (!isValidDate) {
			throw customError({ message: "a data informada é inválida" });
		}

		const result = await prisma.goals.update({
			data: { value, date_value: formatedDate },
			where: {
				id: id,
				user_id: user_id,
			},
		});
		return result;
	}

	//----------------------DELETE
	static async delete(id: number, user_id: number) {
		const result = await prisma.goals.delete({
			where: {
				id: id,
				user_id: user_id,
			},
		});
		return result;
	}
}
