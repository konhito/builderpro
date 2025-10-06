import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, orderItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST - Create new order
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      phone,
      notes,
      paymentMethod,
      items,
    } = body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const [newOrder] = await db.insert(order).values({
      userId: session.user.id,
      orderNumber,
      status: "pending",
      totalAmount: "0", // Will be updated by admin
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      phone,
      notes: notes || null,
      paymentMethod,
      paymentStatus: "pending",
    }).returning();

    // Create order items
    for (const item of items) {
      await db.insert(orderItem).values({
        orderId: newOrder.id,
        productSku: item.productSku,
        productName: item.productName,
        productImage: item.productImage,
        productSize: item.productSize,
        quantity: item.quantity,
        priceAtTime: null, // Will be updated by admin
      });
    }

    return NextResponse.json({ success: true, orderId: newOrder.id, orderNumber: newOrder.orderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.select().from(order).where(eq(order.userId, session.user.id)).orderBy(order.createdAt);
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

