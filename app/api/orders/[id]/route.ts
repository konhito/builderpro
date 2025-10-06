import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, orderItem } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - Fetch specific order with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Fetch order
    const [orderData] = await db.select()
      .from(order)
      .where(and(eq(order.id, id), eq(order.userId, session.user.id)));

    if (!orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch order items
    const items = await db.select().from(orderItem).where(eq(orderItem.orderId, id));

    return NextResponse.json({ ...orderData, items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

