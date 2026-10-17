import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true, quiet: true });

// Safety check: never run tests against the development database
const dbName = new URL(process.env.DATABASE_URL ?? "postgres://x/none").pathname.slice(1);
if (!dbName.endsWith("_test")) {
    throw new Error(`Tests must run against a *_test database, got "${dbName}"`);
}
