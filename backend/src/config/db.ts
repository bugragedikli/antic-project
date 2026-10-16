import { env } from "./env.ts";
import {Pool} from "pg";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Database error', err);
});

export default pool;