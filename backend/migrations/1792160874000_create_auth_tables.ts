import { sql, type Kysely } from 'kysely'

// Better Auth core tables + admin plugin fields + our firstName/lastName.
// Column names are camelCase because Better Auth expects them that way.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('user')
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('email', 'text', (col) => col.notNull().unique())
		.addColumn('emailVerified', 'boolean', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updatedAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		// user.additionalFields in lib/auth.ts
		.addColumn('firstName', 'text', (col) => col.notNull())
		.addColumn('lastName', 'text', (col) => col.notNull())
		// admin plugin
		.addColumn('role', 'text')
		.addColumn('banned', 'boolean')
		.addColumn('banReason', 'text')
		.addColumn('banExpires', 'timestamptz')
		.execute()

	await db.schema
		.createTable('session')
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
		.addColumn('token', 'text', (col) => col.notNull().unique())
		.addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
		.addColumn('ipAddress', 'text')
		.addColumn('userAgent', 'text')
		.addColumn('userId', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		// admin plugin
		.addColumn('impersonatedBy', 'text')
		.execute()

	await db.schema
		.createTable('account')
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('accountId', 'text', (col) => col.notNull())
		.addColumn('providerId', 'text', (col) => col.notNull())
		.addColumn('userId', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		.addColumn('accessToken', 'text')
		.addColumn('refreshToken', 'text')
		.addColumn('idToken', 'text')
		.addColumn('accessTokenExpiresAt', 'timestamptz')
		.addColumn('refreshTokenExpiresAt', 'timestamptz')
		.addColumn('scope', 'text')
		.addColumn('password', 'text')
		.addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
		.execute()

	await db.schema
		.createTable('verification')
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('identifier', 'text', (col) => col.notNull())
		.addColumn('value', 'text', (col) => col.notNull())
		.addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
		.addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updatedAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.execute()

	await db.schema.createIndex('session_userId_idx').on('session').column('userId').execute()
	await db.schema.createIndex('account_userId_idx').on('account').column('userId').execute()
	await db.schema.createIndex('verification_identifier_idx').on('verification').column('identifier').execute()
}

// Reverse order: tables that reference "user" must go first
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('verification').execute()
	await db.schema.dropTable('account').execute()
	await db.schema.dropTable('session').execute()
	await db.schema.dropTable('user').execute()
}
