import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import goalController from "../controllers/goalController";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const user_id = res.locals.user_id;

	const categories = await goalController.getAll(user_id);
	res.json({ data: categories });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const category = await goalController.getId(id, user_id);
		res.json({ data: category });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const user_id = res.locals.user_id;

	try {
		const result = await goalController.create(req, user_id);
		res.status(201).json({ response: "meta criada com sucesso!", data: result });
	} catch (error) {
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

		errorHandler(res, String(error));
	}
});

router.put("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const result = await goalController.update(req, id, user_id);
		res.json({ response: "meta atualizada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to update not found")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o código da meta informada não consta em seus registros!",
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

		errorHandler(res, String(error));
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user_id = res.locals.user_id;

	try {
		const result = await goalController.delete(id, user_id);
		res.json({ response: "meta deletada com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to delete does not exist")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o código da meta informada não consta em seus registros!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

export default router;
