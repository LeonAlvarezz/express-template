import { db } from ".";
import { sql } from "drizzle-orm";

const resetDatabase = async () => {
  try {
    const typesResult = await db.execute<{ typname: string }>(sql`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `);
    for (const type of typesResult.rows || []) {
      await db.execute(
        sql`DROP TYPE IF EXISTS "${sql.raw(type.typname)}" CASCADE;`
      );
      console.log(`Dropped type: ${type.typname}`);
    }

    const tablesResult = await db.execute<{ table_name: string }>(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);

    for (const table of tablesResult.rows || []) {
      await db.execute(
        sql`DROP TABLE IF EXISTS "${sql.raw(table.table_name)}" CASCADE;`
      );
      console.log(`Dropped table: ${table.table_name}`);
    }

    await db.execute(sql`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`);
    console.log(`Dropped migration table: drizzle`);

    console.log("Database reset successfully: all tables and types dropped");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
};

resetDatabase().catch(console.error);
