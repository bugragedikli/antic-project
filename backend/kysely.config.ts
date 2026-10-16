import { defineConfig } from "kysely-ctl";
import { db } from "./src/database.ts";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  },
});
