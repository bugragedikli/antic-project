import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.ts";
import { db } from "../src/database.ts";
import { signUp } from "./helpers/auth.ts";

describe("GET /api/admin/stats", () => {
    it("returns 401 without a session", async () => {
        const res = await request(app).get("/api/admin/stats");

        expect(res.status).toBe(401);
        expect(res.body.code).toBe("UNAUTHORIZED");
    });

    it("returns 403 for a signed-in non-admin", async () => {
        const { agent } = await signUp();

        const res = await agent.get("/api/admin/stats");

        expect(res.status).toBe(403);
        expect(res.body.code).toBe("FORBIDDEN");
    });

    it("returns stats for an admin", async () => {
        const { agent, email } = await signUp();
        await db.updateTable("user").set({ role: "admin" }).where("email", "=", email).execute();

        const res = await agent.get("/api/admin/stats");

        expect(res.status).toBe(200);
        expect(res.body.totalUsers).toBeGreaterThanOrEqual(1);
    });
});
