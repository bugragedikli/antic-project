import express from "express";
import { protect, requireAdmin } from "../middleware/auth.ts";
import pool from "../config/db.ts";

const router = express.Router();

// Every route below requires an admin
router.use(protect, requireAdmin);

router.get("/stats", async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            (SELECT count(*) FROM "user")::int AS "totalUsers",
            (SELECT count(*) FROM "user" WHERE "createdAt" > now() - interval '7 days')::int AS "newUsersThisWeek",
            (SELECT count(*) FROM session WHERE "expiresAt" > now())::int AS "activeSessions"
    `);
    res.json(rows[0]);
});

const USERS_PAGE_SIZE = 20;

// GET /users?q=ahmet&page=2 → matches email, first name, last name or full name
router.get("/users", async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
    const page = Math.max(parseInt(String(req.query.page)) || 1, 1);

    // Escape LIKE wildcards so "%" or "_" in the search box are matched literally
    const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;

    const { rows } = await pool.query(`
        SELECT
            id, email, "firstName", "lastName", "emailVerified", role,
            banned, "banReason", "banExpires", "createdAt",
            count(*) OVER()::int AS total
        FROM "user"
        WHERE $1 = ''
            OR email ILIKE $2
            OR "firstName" ILIKE $2
            OR "lastName" ILIKE $2
            OR ("firstName" || ' ' || "lastName") ILIKE $2
        ORDER BY "createdAt" DESC
        LIMIT $3 OFFSET $4
    `, [q, pattern, USERS_PAGE_SIZE, (page - 1) * USERS_PAGE_SIZE]);

    res.json({
        users: rows.map(({ total, ...user }) => user),
        total: rows[0]?.total ?? 0,
        page,
        pageSize: USERS_PAGE_SIZE,
    });
});

export default router;