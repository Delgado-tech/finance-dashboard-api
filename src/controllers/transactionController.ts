import * as controllerImports from "./_index";
import { Request } from "express";
import categoryController from "./categoryController";

const { prisma, customError, fns } = controllerImports;

export default class goalController {
	//----------------------GET-ALL
	static async getAll(user_id: number) {
		const transactions = await prisma.transactions.findMany({
			select: {
				id: true,
				user_id: true,
				value: true,
				date_value: true,
				description: true,
				categories: {
					select: {
						id: true,
						name: true,
						categories_icons: {
							select: {
								id: true,
								icon_name: true,
							},
						},
					},
				},
				payment_methods: {
					select: {
						id: true,
						method_name: true,
					},
				},
				transaction_type: {
					select: {
						id: true,
						type_name: true,
					},
				},
			},
			where: {
				user_id: user_id,
			},
		});
		return transactions;
	}

	//----------------------GET-ID
	static async getId(id: number, user_id: number) {
		if (isNaN(id)) {
			throw customError({ message: "o id inserido é inválido!" });
		}
		const category = await prisma.transactions.findFirst({
			select: {
				id: true,
				user_id: true,
				value: true,
				date_value: true,
				description: true,
				categories: {
					select: {
						id: true,
						name: true,
						categories_icons: {
							select: {
								id: true,
								icon_name: true,
							},
						},
					},
				},
				payment_methods: {
					select: {
						id: true,
						method_name: true,
					},
				},
				transaction_type: {
					select: {
						id: true,
						type_name: true,
					},
				},
			},
			where: {
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
		const {
			value,
			description,
			date,
			categorie_id,
			payment_method_id,
			transaction_type_id,
		} = req.body;

		if (typeof value !== "number" || value < 0) {
			throw customError({ message: "o valor da transação é inválido" });
		}

		if (typeof categorie_id !== "number") {
			throw customError({ message: "o id da categoria é inválido" });
		}

		if (typeof payment_method_id !== "number") {
			throw customError({ message: "o id do metodo de pagamento é inválido" });
		}

		if (typeof transaction_type_id !== "number") {
			throw customError({ message: "o id do tipo da transação é inválido" });
		}

		const formatedDate = new Date(fns.formatISO(date));
		const isValidDate = fns.isValid(formatedDate);

		if (!isValidDate) {
			throw customError({ message: "a data informada é inválida" });
		}

		const isUserCategory = await categoryController.getId(categorie_id, user_id);

		if (!isUserCategory) {
			throw customError({ message: "o id da categoria informada é inválida" });
		}

		const result = await prisma.transactions.create({
			data: {
				value,
				description,
				date_value: formatedDate,
				categorie_id,
				payment_method_id,
				transaction_type_id,
				user_id,
			},
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

		const {
			value,
			description,
			date,
			categorie_id,
			payment_method_id,
			transaction_type_id,
		} = req.body;

		if (typeof value !== "number" || value < 0) {
			throw customError({ message: "o valor da transação é inválido" });
		}

		if (typeof categorie_id !== "number") {
			throw customError({ message: "o id da categoria é inválido" });
		}

		if (typeof payment_method_id !== "number") {
			throw customError({ message: "o id do metodo de pagamento é inválido" });
		}

		if (typeof transaction_type_id !== "number") {
			throw customError({ message: "o id do tipo da transação é inválido" });
		}

		const formatedDate = new Date(fns.formatISO(date));
		const isValidDate = fns.isValid(formatedDate);

		if (!isValidDate) {
			throw customError({ message: "a data informada é inválida" });
		}

		const isUserCategory = await categoryController.getId(categorie_id, user_id);

		if (!isUserCategory) {
			throw customError({ message: "o id da categoria informada é inválida" });
		}

		const result = await prisma.transactions.update({
			data: {
				value,
				description,
				date_value: formatedDate,
				categorie_id,
				payment_method_id,
				transaction_type_id,
				user_id,
			},
			where: {
				id: id,
				user_id: user_id,
			},
		});
		return result;
	}

	//----------------------DELETE
	static async delete(id: number, user_id: number) {
		if (isNaN(id) || id < 0) {
			throw customError({
				message: "o id inserido é inválido!",
			});
		}

		const result = await prisma.transactions.delete({
			where: {
				id: id,
				user_id: user_id,
			},
		});
		return result;
	}
}
