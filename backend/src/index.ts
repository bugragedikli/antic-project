import { env } from "./config/env.ts";
import { logger } from "./lib/logger.ts";
import app from "./app.ts";

const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Server is running");
});

server.on("error", (err) => {
    logger.fatal(err, "Server error");
    process.exit(1);
});