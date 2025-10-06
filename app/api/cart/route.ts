import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await db.select().from(cart).where(eq(cart.userId, session.user.id));
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productSku, productName, productImage, productSize, quantity } = body;

    // Check if item already exists
    const existing = await db.select().from(cart).where(
      and(eq(cart.userId, session.user.id), eq(cart.productSku, productSku))
    );

    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + (quantity || 1);
      await db.update(cart)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cart.id, existing[0].id));
    } else {
      // Insert new item
      await db.insert(cart).values({
        userId: session.user.id,
        productSku,
        productName,
        productImage,
        productSize,
        quantity: quantity || 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// DELETE - Clear cart
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.delete(cart).where(eq(cart.userId, session.user.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}

