import { pino } from "pino";
import { env } from "../config/env.ts";

export const logger = pino({
    level: env.LOG_LEVEL,
    // Readable output in dev; plain JSON in production for log services
    transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    // Never write session cookies or tokens into logs
    redact: ["req.headers.cookie", "req.headers.authorization", 'res.headers["set-cookie"]'],
});
