import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('categories')
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
		.addColumn('parent_id', 'uuid', (col) => col.references('categories.id').onDelete('restrict'))
		.addColumn('name', 'jsonb', (col) => col.notNull())
		.addColumn('slug', 'text', (col) => col.unique().notNull())
		.addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addCheckConstraint('categories_name_has_en', sql`jsonb_typeof(name) = 'object' and name ? 'en'`)
		.addCheckConstraint('categories_not_own_parent', sql`parent_id <> id`)
		.execute()

		await db.schema.createIndex('categories_parent_id_idx').on('categories').column('parent_id').execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('categories').execute()
}
