import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Hardcoded DATABASE_URL for development
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5rciZ2fWaeBD@ep-divine-haze-a10g72eb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Create postgres client
const client = postgres(DATABASE_URL);

// Create drizzle instance
export const db = drizzle(client, { schema });


