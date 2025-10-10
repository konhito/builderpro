import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" },
        { status: 400 }
      );
    }

    // Delete products
    const deletedProducts = await db
      .delete(product)
      .where(inArray(product.id, productIds))
      .returning();

    return NextResponse.json({
      message: `Successfully deleted ${deletedProducts.length} products`,
      deletedCount: deletedProducts.length,
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 }
    );
  }
}
