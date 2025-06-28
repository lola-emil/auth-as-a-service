import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";
import ValidationError from "../exceptions/ValidationError";
import NotFoundError from "../exceptions/NotFoundError";

export default function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): unknown {
    if (error instanceof ValidationError) {
        const { errors, message } = error;
        Logger.error(`${error.message}\n${error.stack}`);
        return res.status(400).json({
            message,
            errors
        });
    }

    else if (error instanceof NotFoundError) {
        const { message } = error;

        return res.status(404).json({
            message: message ?? "Resource not found"
        });
    }

    else {
        Logger.error(`Internal Server Error: ${error.message}\n${error.stack}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}