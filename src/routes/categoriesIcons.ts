import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import categoryIconController from "../controllers/categoryIconController";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const icons = await categoryIconController.getAll();
	res.json({ data: icons });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	try {
		const icon = await categoryIconController.getId(id);
		res.json({ data: icon });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const access_level = res.locals.access_level;

	try {
		const result = await categoryIconController.create(req, access_level);
		res.status(201).json({ response: "ícone criado com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Unique constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o nome do ícone informado já existe!",
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
	const access_level = res.locals.access_level;

	try {
		const result = await categoryIconController.update(req, id, access_level);
		res.json({ response: "ícone atualizado com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to update not found")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código do ícone informado não existe!",
						throwError: false,
					})
				)
			);
		}

		if (String(error).includes("Unique constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o nome do ícone informado já existe!",
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
	const access_level = res.locals.access_level;

	try {
		const result = await categoryIconController.delete(id, access_level);
		res.json({ response: "ícone deletado com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Record to delete does not exist")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código do ícone informado não existe!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

export default router;
