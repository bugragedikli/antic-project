import "./helpers/load-env.ts";
import { afterAll } from "vitest";
import { db } from "../src/database.ts";

afterAll(async () => {
    await db.destroy(); // closes the shared pg pool too
});
