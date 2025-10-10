import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { eq, sql, or, like, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = 20;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(order.orderNumber, `%${search}%`),
          like(order.customerEmail, `%${search}%`),
          like(order.customerName, `%${search}%`)
        )!
      );
    }
    
    if (status) {
      whereConditions.push(eq(order.status, status));
    }

    // Fetch orders
    const orders = await db
      .select()
      .from(order)
      .where(whereConditions.length > 0 ? or(...whereConditions) : undefined)
      .orderBy(desc(order.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(order)
      .where(whereConditions.length > 0 ? or(...whereConditions) : undefined);

    const totalCountValue = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCountValue / limit);

    return NextResponse.json({
      orders,
      totalPages,
      currentPage: page,
      totalCount: totalCountValue,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
