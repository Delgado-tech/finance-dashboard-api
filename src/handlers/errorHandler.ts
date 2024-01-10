import { Response } from "express";

export default function errorHandler(res: Response, errorString: string) {
	if (errorString.startsWith("Error: custom:")) {
		const errorData = errorString.replace("Error: custom: ", "").split(": ");
		return res.status(Number(errorData[0])).json({ response: errorData[1] });
	}

	res.status(400).json({
		response: "ocorreu um erro inesperado, tente novamente mais tarde!",
	});
}
