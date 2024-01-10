import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import errorHandler, { customError } from "../handlers/errorHandler";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const access_level = res.locals.access_level;

	const users = await userController.getAll(access_level);
	res.json({ data: users });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const access_level = res.locals.access_level;

	try {
		const user = await userController.getId(id, access_level);
		res.json({ data: user });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const access_level = res.locals.access_level;

	try {
		const result = await userController.create(req, access_level);
		res.status(201).json({ result });
	} catch (error) {
		if (String(error).includes("Unique constraint")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o e-mail informado já está em uso!",
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
		const result = await userController.update(req, id, access_level);
		res.json({ data: result });
	} catch (error) {
		if (String(error).includes("Unique constraint")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o e-mail informado já está em uso!",
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
		const result = await userController.delete(id, access_level);
		res.json({ data: result });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

export default router;
