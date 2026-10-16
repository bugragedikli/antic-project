import "dotenv/config";
import * as z from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().startsWith("postgres", "DATABASE_URL must be a postgres:// connection string"),
    PORT: z.coerce.number().int().positive().default(5000),
    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    CLIENT_URL: z.url().default("http://localhost:3000"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment variables:\n" + z.prettifyError(result.error));
    process.exit(1);
}

export const env = result.data;