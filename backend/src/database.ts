import type { DB } from './types/db.ts';
import pool from './config/db.ts';
import { Kysely, PostgresDialect } from 'kysely';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  })
});