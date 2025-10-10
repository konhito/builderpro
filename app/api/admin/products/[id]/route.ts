import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin authentication is handled by the layout

    const productData = await db
      .select()
      .from(product)
      .where(eq(product.id, params.id))
      .limit(1);

    if (productData.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(productData[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin authentication is handled by the layout

    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id, createdAt, ...updateData } = body;

    const updatedProduct = await db
      .update(product)
      .set({ 
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(product.id, params.id))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin authentication is handled by the layout

    const deletedProduct = await db
      .delete(product)
      .where(eq(product.id, params.id))
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}