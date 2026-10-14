import type { auth } from "../lib/auth.ts";

type Session = typeof auth.$Infer.Session;

// Set by the protect / optionalAuth middleware
declare global {
    namespace Express {
        interface Request {
            user?: Session["user"];
            session?: Session["session"];
        }
    }
}

export {};
