import express, { response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { userController } from "../controllers/userController";
import errorHandler from "../handlers/errorHandler";
const prisma = new PrismaClient();

const router = express.Router();

router.get("/", async (req, res) => {
	const access_level = 4; //res.locals.access_level;

	const users = await userController.getAll(access_level);
	res.json({ data: users });
});

router.get("/:id", async (req, res) => {
	const id = Number(req.params.id);
	const access_level = 4; //res.locals.access_level;

	try {
		const user = await userController.getId(id, access_level);
		res.json({ data: user });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

router.post("/", async (req, res) => {
	const access_level = 4; //res.locals.access_level;

	try {
		const result = await userController.create(req, access_level);
		res.status(201).json({ result });
	} catch (error) {
		if (String(error).includes("email")) {
			return errorHandler(
				res,
				String("Error: custom: 400: o e-mail informado já está em uso!")
			);
		}

		errorHandler(res, String(error));
	}
});

router.put("/:id", async (req, res) => {
	const id = Number(req.params.id);
	const access_level = 4; //res.locals.access_level;

	try {
		const result = await userController.update(req, id, access_level);
		res.json({ data: result });
	} catch (error) {
		if (String(error).includes("email")) {
			return errorHandler(
				res,
				String("Error: custom: 400: o e-mail informado já está em uso!")
			);
		}

		errorHandler(res, String(error));
	}
});

router.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	const access_level = 4; //res.locals.access_level;

	try {
		const result = await userController.delete(id, access_level);
		res.json({ data: result });
	} catch (error) {
		errorHandler(res, String(error));
	}
});

export default router;
