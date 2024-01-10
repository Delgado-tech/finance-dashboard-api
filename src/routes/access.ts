import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import authController from "../controllers/accessController";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
	try {
		const token = await authController.login(req);
		res.status(200).json({ token });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/register", async (req: Request, res: Response) => {
	try {
		const token = await authController.register(req);
		res.status(200).json({ response: "usuário cadastrado com sucesso!", token });
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

export default router;
