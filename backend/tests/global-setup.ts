import "./helpers/load-env.ts";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { sql } from "kysely";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import { db } from "../src/database.ts";

// Runs once before all test files: fresh schema + all migrations
export default async function setup() {
    await sql`DROP SCHEMA public CASCADE`.execute(db);
    await sql`CREATE SCHEMA public`.execute(db);

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.resolve("migrations"),
            // Windows paths like C:\... can't be passed to import() directly
            import: (filePath) => import(pathToFileURL(filePath).href),
        }),
    });

    const { error, results } = await migrator.migrateToLatest();
    for (const r of results ?? []) {
        if (r.status === "Error") console.error(`Migration failed: ${r.migrationName}`);
    }

    await db.destroy();
    if (error) throw error;
}
