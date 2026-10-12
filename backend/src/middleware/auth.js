import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const protect = async (req, res, next) => {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
        return res.status(401).json({ message: 'Not authorized, no session' });
    }

    req.user = session.user;
    req.session = session.session;
    next();
}

export const optionalAuth = async (req, res, next) => {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
        next();
        return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
};

// Use after protect: protect sets req.user
export const requireAdmin = (req, res, next) => {
    const roles = req.user?.role?.split(",") ?? [];

    if (!roles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};