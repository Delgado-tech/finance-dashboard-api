import { NextFunction, Request, Response } from "express";
import errorHandler, { customError } from "../handlers/errorHandler";
import jwt from "jsonwebtoken";

export default function auth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.token;

		if (!token) {
			throw new Error();
		}

		const decodedToken = jwt.verify(
			token,
			String(process.env.JWT_SECRET)
		) as jwt.JwtPayload;

		res.locals.access_level = 4; //decodedToken.ac;

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
