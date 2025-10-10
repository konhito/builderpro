import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    // Get unique categories
    const categoriesResult = await db
      .selectDistinct({ category: product.category })
      .from(product)
      .where(sql`${product.category} IS NOT NULL AND ${product.category} != ''`);

    const categories = categoriesResult
      .map(row => row.category)
      .filter(Boolean)
      .sort();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
