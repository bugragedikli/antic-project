import { env } from "./config/env.ts";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimit.ts";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { notFoundHandler, errorHandler } from "./middleware/error.ts";
import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";
import { logger } from "./lib/logger.ts";

const app = express();

app.use(pinoHttp({
    logger,
    genReqId: (req, res) => {
        const id = randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
    },
}));

app.use(cors({
    origin: env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(helmet());
app.use("/api", apiLimiter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

//routes
import adminRoutes from "./routes/admin.routes.ts";
app.use("/api/admin", adminRoutes);


// Catch-all route for unmatched paths
app.use(notFoundHandler);

// Error handling middleware should be the last middleware added
app.use(errorHandler);

export default app;