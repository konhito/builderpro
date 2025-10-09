import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productData = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    if (productData.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productData[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const {
      sku,
      title,
      description,
      price,
      originalPrice,
      size,
      quantity,
      category,
      image,
      images,
      specifications,
      availability,
      isActive,
      isFeatured,
      stockQuantity,
      minOrderQuantity,
      maxOrderQuantity,
      weight,
      dimensions,
      tags,
      seoTitle,
      seoDescription,
      metaKeywords,
    } = body;

    // Validate required fields
    if (!sku || !title) {
      return NextResponse.json(
        { error: "SKU and title are required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and if new SKU already exists
    if (sku !== existingProduct[0].sku) {
      const skuExists = await db
        .select()
        .from(product)
        .where(eq(product.sku, sku))
        .limit(1);

      if (skuExists.length > 0) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await db
      .update(product)
      .set({
        sku,
        title,
        description: description || null,
        price: price ? price.toString() : null,
        originalPrice: originalPrice ? originalPrice.toString() : null,
        size: size || null,
        quantity: quantity || null,
        category: category || null,
        image: image || null,
        images: images ? JSON.stringify(images) : null,
        specifications: specifications ? JSON.stringify(specifications) : null,
        availability: availability || "in_stock",
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
        minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 1,
        maxOrderQuantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : null,
        weight: weight ? weight.toString() : null,
        dimensions: dimensions ? JSON.stringify(dimensions) : null,
        tags: tags ? JSON.stringify(tags) : null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metaKeywords: metaKeywords || null,
        updatedAt: new Date(),
      })
      .where(eq(product.id, id))
      .returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    // Check if product exists
    const existingProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await db
      .delete(product)
      .where(eq(product.id, id));

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
