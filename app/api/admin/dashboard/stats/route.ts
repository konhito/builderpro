import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product, order } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    console.log("Fetching dashboard stats...");

    // Get total products count
    let totalProducts = 0;
    try {
      const totalProductsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(product);
      totalProducts = totalProductsResult[0]?.count || 0;
      console.log(`Total products: ${totalProducts}`);
    } catch (error) {
      console.error("Error fetching total products:", error);
    }

    // Get active products count
    let activeProducts = 0;
    try {
      const activeProductsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(product)
        .where(eq(product.isActive, true));
      activeProducts = activeProductsResult[0]?.count || 0;
      console.log(`Active products: ${activeProducts}`);
    } catch (error) {
      console.error("Error fetching active products:", error);
    }

    // Get total orders count
    let totalOrders = 0;
    try {
      const totalOrdersResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(order);
      totalOrders = totalOrdersResult[0]?.count || 0;
      console.log(`Total orders: ${totalOrders}`);
    } catch (error) {
      console.error("Error fetching total orders:", error);
    }

    // Get total revenue (sum of all order totals)
    let totalRevenue = 0;
    try {
      const totalRevenueResult = await db
        .select({ total: sql<number>`coalesce(sum(${order.totalAmount}), 0)` })
        .from(order);
      totalRevenue = totalRevenueResult[0]?.total || 0;
      console.log(`Total revenue: ${totalRevenue}`);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }

    const stats = {
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
    };

    console.log("Dashboard stats fetched successfully:", stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard stats",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
