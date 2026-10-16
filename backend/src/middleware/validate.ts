import type { RequestHandler } from "express";
import * as z from "zod";

// Each part is optional: validate({ body }) or validate({ params, query })
export const validate = <
    B extends z.ZodType = z.ZodUnknown,
    Q extends z.ZodType = z.ZodUnknown,
    P extends z.ZodType = z.ZodUnknown,
>(schemas: { body?: B; query?: Q; params?: P }): RequestHandler<z.infer<P>, any, z.infer<B>, z.infer<Q>> =>
    (req, _res, next) => {
        if (schemas.params) {
            req.params = schemas.params.parse(req.params);
        }
        if (schemas.query) {
            // In Express 5 req.query is a getter and can't be assigned, so we redefine it
            Object.defineProperty(req, "query", { value: schemas.query.parse(req.query) });
        }
        if (schemas.body) {
            req.body = schemas.body.parse(req.body);
        }
        next();
    };
