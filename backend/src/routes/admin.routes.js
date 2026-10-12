import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import pool from "../config/db.js";

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

export default router;