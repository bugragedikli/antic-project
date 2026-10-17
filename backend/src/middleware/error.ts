import type { ErrorRequestHandler, RequestHandler } from "express";
import * as z from "zod";
import { AppError, notFound } from "../lib/errors.ts";

// Runs when no route matched
export const notFoundHandler: RequestHandler = (req) => {
    throw notFound(`Route ${req.method} ${req.path} not found`);
};

// Express recognizes an error handler by its 4 parameters, so _next must stay
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    // Response already started (e.g. during streaming): let Express close the connection
    if (res.headersSent) {
        _next(err);
        return;
    }

    if (err instanceof AppError) {
        res.status(err.status).json({ message: err.message, code: err.code, details: err.details });
        return;
    }

    if (err instanceof z.ZodError) {
        res.status(400).json({
            message: "Invalid request",
            code: "VALIDATION_ERROR",
            details: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        });
        return;
    }

    // Errors from express.json(): broken JSON (400), body too large (413)
    if (err.expose && typeof err.status === "number" && err.status < 500) {
        res.status(err.status).json({ message: err.message, code: "BAD_REQUEST" });
        return;
    }

    // Anything else is a bug: log the details, hide them from the client
    req.log.error({ err }, "Unhandled error");
    res.status(500).json({ message: "Something went wrong", code: "INTERNAL_ERROR" });
};
