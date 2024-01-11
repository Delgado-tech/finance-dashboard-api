import * as controllerImports from "./_index";
import { Request } from "express";
import userController from "./userController";

const { prisma, bcrypt, customError, jwt } = controllerImports;

export default class authController {
	//----------------------LOGIN
	static async login(req: Request) {
		const { email, password } = req.body;

		const user = await prisma.users.findFirst({
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
				access_level_id: true,
			},
			where: { email: email },
		});

		if (user === null) {
			throw customError({ message: "E-mail ou senha inválido!" });
		}

		const samePass = await bcrypt.compare(password, user.password);

		if (!samePass) {
			throw customError({ message: "E-mail ou senha inválido!" });
		}

		const token = jwt.sign(
			{ id: user.id, name: user.name, ac: user.access_level_id },
			String(process.env.JWT_SECRET)
		);

		return token;
	}

	//----------------------REGISTER
	static async register(req: Request) {
		const user = await userController.create(req, 4);

		const token = jwt.sign(
			{ id: user.id, name: user.name, ac: user.access_level_id },
			String(process.env.JWT_SECRET)
		);

		return token;
	}
}
