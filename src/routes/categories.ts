import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import categoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const user_id = res.locals.user_id;

	const categories = await categoryController.getAll(user_id);
	res.json({ data: categories });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const category = await categoryController.getId(id, user_id);
		res.json({ data: category });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const user_id = res.locals.user_id;

	try {
		const result = await categoryController.create(req, user_id);
		res
			.status(201)
			.json({ response: "categoria criada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Foreign key constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o id do ícone informado é inválido!",
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
		const result = await categoryController.update(req, id, user_id);
		res.json({ response: "categoria atualizada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to update not found")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código da categoria informada não consta em seus registros!",
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
						message: "o id do ícone informado é inválido!",
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
		const result = await categoryController.delete(id, user_id);
		res.json({ response: "categoria deletada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to delete does not exist")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código da categoria informada não consta em seus registros!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

export default router;
