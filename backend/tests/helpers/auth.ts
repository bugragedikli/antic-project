import { randomUUID } from "node:crypto";
import request from "supertest";
import { expect } from "vitest";
import app from "../../src/app.ts";
import { env } from "../../src/config/env.ts";

// Signs up a fresh user; the returned agent keeps the session cookie for later requests
export async function signUp() {
    const agent = request.agent(app);
    const email = `user-${randomUUID()}@test.com`;

    const res = await agent
        .post("/api/auth/sign-up/email")
        .set("Origin", env.CLIENT_URL)
        .send({ email, password: "password123", firstName: "Test", lastName: "User", name: "Test User" });

    expect(res.status).toBe(200);
    return { agent, email };
}
