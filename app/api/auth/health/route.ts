import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
    
    // Test if auth tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'session', 'account', 'verification')
    `);

    const tableNames = (tables as unknown as Array<{ table_name: string }>).map((row) => row.table_name);
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      tables: {
        user: tableNames.includes("user"),
        session: tableNames.includes("session"),
        account: tableNames.includes("account"),
        verification: tableNames.includes("verification"),
      },
      authEndpoint: "/api/auth",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "unhealthy",
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

