import { Response } from "express";

interface ISetError {
	status?: number;
	message?: string;
	throwError?: boolean;
}

const unexpectedErrorMessage =
	"ocorreu um erro inesperado, tente novamente mais tarde!";

export default function errorHandler(res: Response, errorString: string) {
	if (errorString.startsWith("Error: custom:")) {
		const errorData = errorString.replace("Error: custom: ", "").split(": ");
		return res.status(Number(errorData[0])).json({ response: errorData[1] });
	}

	res.status(400).json({
		response: unexpectedErrorMessage,
	});
}

export function customError({
	status = 400,
	message = unexpectedErrorMessage,
	throwError = true,
}: ISetError): string {
	const customErrorString = `custom: ${status}: ${message}`;

	if (throwError) {
		throw new Error(customErrorString);
	}

	return `Error: ${customErrorString}`;
}
