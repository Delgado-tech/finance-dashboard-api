import express, { Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import paymentMethodController from "../controllers/paymentMethodController";

const router = express.Router();

router.get("/", async (_, res: Response) => {
	const methods = await paymentMethodController.getAll();
	res.json({ data: methods });
});

router.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	try {
		const method = await paymentMethodController.getId(id);
		res.json({ data: method });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req: Request, res: Response) => {
	const access_level = res.locals.access_level;

	try {
		const result = await paymentMethodController.create(req, access_level);
		res
			.status(201)
			.json({ response: "método de pagamento criado com sucesso!", data: result });
	} catch (error) {
		if (String(error).includes("Unique constraint failed")) {
			return errorHandler(
				res,
				String(
					customError({
						message: "o nome do método de pagamento informado já existe!",
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
		const result = await paymentMethodController.update(req, id, access_level);
		res.json({
			response: "método de pagamento atualizado com sucesso!",
			data: result,
		});
	} catch (error) {
		if (String(error).includes("Record to update not found")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código do método de pagamento informado não existe!",
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
						message: "o nome do método de pagamento informado já existe!",
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
		const result = await paymentMethodController.delete(id, access_level);
		res.json({
			response: "método de pagamento deletado com sucesso!",
			data: result,
		});
	} catch (error) {
		if (String(error).includes("Record to delete does not exist")) {
			return errorHandler(
				res,
				String(
					customError({
						status: 404,
						message: "o código do método de pagamento informado não existe!",
						throwError: false,
					})
				)
			);
		}

		errorHandler(res, String(error));
	}
});

export default router;
