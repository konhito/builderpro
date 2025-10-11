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
      totalRevenue = Number(totalRevenueResult[0]?.total) || 0;
      console.log(`Total revenue: ${totalRevenue}`);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }

    // Get products by brand
    let productsByBrand = [];
    try {
      const brandResult = await db
        .select({ 
          brand: product.brand,
          count: sql<number>`count(*)`
        })
        .from(product)
        .where(sql`${product.brand} IS NOT NULL`)
        .groupBy(product.brand)
        .orderBy(sql`count(*) DESC`)
        .limit(10);
      productsByBrand = brandResult;
      console.log(`Products by brand: ${productsByBrand.length} brands`);
    } catch (error) {
      console.error("Error fetching products by brand:", error);
    }

    // Get products by category/group
    let productsByCategory = [];
    try {
      const categoryResult = await db
        .select({ 
          category: product.group,
          count: sql<number>`count(*)`
        })
        .from(product)
        .where(sql`${product.group} IS NOT NULL`)
        .groupBy(product.group)
        .orderBy(sql`count(*) DESC`)
        .limit(10);
      productsByCategory = categoryResult;
      console.log(`Products by category: ${productsByCategory.length} categories`);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }

    // Get recent products
    let recentProducts = [];
    try {
      const recentResult = await db
        .select({
          sku: product.sku,
          title: product.title,
          brand: product.brand,
          price: product.price,
          createdAt: product.createdAt
        })
        .from(product)
        .orderBy(sql`${product.createdAt} DESC`)
        .limit(10);
      recentProducts = recentResult;
      console.log(`Recent products: ${recentProducts.length} products`);
    } catch (error) {
      console.error("Error fetching recent products:", error);
    }

    // Get price statistics
    let priceStats = { min: 0, max: 0, avg: 0 };
    try {
      const priceResult = await db
        .select({
          min: sql<number>`min(${product.price})`,
          max: sql<number>`max(${product.price})`,
          avg: sql<number>`avg(${product.price})`
        })
        .from(product)
        .where(sql`${product.price} IS NOT NULL AND ${product.price} > 0`);
      
      if (priceResult[0]) {
        priceStats = {
          min: Number(priceResult[0].min) || 0,
          max: Number(priceResult[0].max) || 0,
          avg: Number(priceResult[0].avg) || 0
        };
      }
      console.log(`Price stats: min=${priceStats.min}, max=${priceStats.max}, avg=${priceStats.avg}`);
    } catch (error) {
      console.error("Error fetching price statistics:", error);
    }

    const stats = {
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      productsByBrand,
      productsByCategory,
      recentProducts,
      priceStats
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
