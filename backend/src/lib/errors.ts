// Codes the frontend can switch on; message is only for showing to the user
export type ErrorCode =
    | "BAD_REQUEST"
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";

export class AppError extends Error {
    // Declared as fields, not "constructor(public status...)":
    // erasableSyntaxOnly in tsconfig forbids parameter properties
    status: number;
    code: ErrorCode;
    details?: unknown;

    constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
        super(message);
        this.name = "AppError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export const badRequest = (message = "Bad request", details?: unknown) =>
    new AppError(400, "BAD_REQUEST", message, details);

export const unauthorized = (message = "You need to sign in") =>
    new AppError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "You don't have permission to do this") =>
    new AppError(403, "FORBIDDEN", message);

export const notFound = (message = "Not found") =>
    new AppError(404, "NOT_FOUND", message);

export const conflict = (message = "Conflict") =>
    new AppError(409, "CONFLICT", message);
