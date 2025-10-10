import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product, order } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    // Get total products count
    const totalProductsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(product);
    const totalProducts = totalProductsResult[0]?.count || 0;

    // Get active products count
    const activeProductsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(product)
      .where(eq(product.isActive, true));
    const activeProducts = activeProductsResult[0]?.count || 0;

    // Get total orders count
    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(order);
    const totalOrders = totalOrdersResult[0]?.count || 0;

    // Get total revenue (sum of all order totals)
    const totalRevenueResult = await db
      .select({ total: sql<number>`coalesce(sum(${order.total}), 0)` })
      .from(order);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
