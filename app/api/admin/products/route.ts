import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { eq, or, like, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(product.title, `%${search}%`),
          like(product.sku, `%${search}%`),
          like(product.description, `%${search}%`)
        )!
      );
    }
    
    if (category) {
      whereConditions.push(eq(product.category, category));
    }
    
    if (status === "active") {
      whereConditions.push(eq(product.isActive, true));
    } else if (status === "inactive") {
      whereConditions.push(eq(product.isActive, false));
    }

    // Get products
    const products = await db
      .select()
      .from(product)
      .where(whereConditions.length > 0 ? or(...whereConditions) : undefined)
      .orderBy(desc(product.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(product)
      .where(whereConditions.length > 0 ? or(...whereConditions) : undefined);

    const totalCountValue = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCountValue / limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalCount: totalCountValue,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

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

    // Check if SKU already exists
    const existingProduct = await db
      .select()
      .from(product)
      .where(eq(product.sku, sku))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Create product
    const newProduct = await db
      .insert(product)
      .values({
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
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
