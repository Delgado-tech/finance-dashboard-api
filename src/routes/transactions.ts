import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import transactionController from "../controllers/transactionController";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const user_id = res.locals.user_id;

	const transactions = await transactionController.getAll(user_id);
	res.json({ data: transactions });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const transactions = await transactionController.getId(id, user_id);
		res.json({ data: transactions });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const user_id = res.locals.user_id;

	try {
		const result = await transactionController.create(req, user_id);
		res
			.status(201)
			.json({ response: "transação criada com sucesso!", data: result });
	} catch (error) {
		console.log(String(error));
		if (String(error).includes("Invalid time value")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "a data informada é inválida!",
						throwError: false,
					})
				)
			);
		}

		if (String(error).includes("Foreign key constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message:
							"o id da categoria, do metodo de pagamento ou do tipo de transação informado é inválido!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

router.put("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const result = await transactionController.update(req, id, user_id);
		res.json({ response: "transação atualizada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to update not found")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o código da transação informada não consta em seus registros!",
						throwError: false,
					})
				)
			);
		}

		if (String(error).includes("Invalid time value")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "a data informada é inválida!",
						throwError: false,
					})
				)
			);
		}

		if (String(error).includes("Foreign key constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message:
							"o id da categoria, do metodo de pagamento ou do tipo de transação informado é inválido!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const result = await transactionController.delete(id, user_id);
		res.json({ response: "transação deletada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to delete does not exist")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o código da transação informada não consta em seus registros!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

export default router;
