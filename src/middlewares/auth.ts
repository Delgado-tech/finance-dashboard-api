import { NextFunction, Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import jwt from "jsonwebtoken";
import userController from "../controllers/userController";

export default async function auth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.token;

		if (!token) {
			throw new Error();
		}

		const decodedToken = jwt.verify(
			token,
			String(process.env.JWT_SECRET)
		) as jwt.JwtPayload;

		const user = await userController
			.getId(decodedToken.id, decodedToken.ac)
			.catch();

		if (!user) {
			throw new Error();
		}

		res.locals.access_level = decodedToken.ac;
		res.locals.user_id = decodedToken.id;

		next();
	} catch {
		errorHandler(
			res,
			String(
				customError({
					status: 401,
					message: "acesso não autorizado!",
					throwError: false,
				})
			)
		);
	}
}
