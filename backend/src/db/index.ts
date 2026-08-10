import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let db: ReturnType<typeof drizzle>;

export function getDb() {
    if (!db) {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL!,
        });

        db = drizzle({ client: pool });
    }

    return db;
}
