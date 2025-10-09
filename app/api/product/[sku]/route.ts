import { NextRequest, NextResponse } from 'next/server';
import { scrapeTimcoProduct } from '@/lib/scraper';
import { db } from '@/lib/db';
import { product } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import productsData from '@/assets/products.json';

type Product = {
  id: string;
  sku: string;
  title: string;
  size?: string;
  quantity?: string;
  image?: string;
  url?: string;
  variants?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    
    if (!sku) {
      return NextResponse.json(
        { error: 'SKU is required' },
        { status: 400 }
      );
    }

    // 1. First, check if we have this product in our database
    const dbProduct = await db
      .select()
      .from(product)
      .where(eq(product.sku, sku))
      .limit(1);

    if (dbProduct.length > 0) {
      const productData = dbProduct[0];
      
      // Return database product with proper formatting
      const enrichedProduct = {
        sku: productData.sku,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        size: productData.size,
        quantity: productData.quantity,
        category: productData.category,
        image: productData.image,
        images: productData.images ? JSON.parse(productData.images) : (productData.image ? [productData.image] : []),
        specifications: productData.specifications ? JSON.parse(productData.specifications) : {},
        availability: productData.availability,
        breadcrumbs: [], // Database products don't have breadcrumbs
        relatedProducts: undefined,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        stockQuantity: productData.stockQuantity,
        minOrderQuantity: productData.minOrderQuantity,
        maxOrderQuantity: productData.maxOrderQuantity,
        weight: productData.weight,
        dimensions: productData.dimensions ? JSON.parse(productData.dimensions) : undefined,
        tags: productData.tags ? JSON.parse(productData.tags) : [],
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        metaKeywords: productData.metaKeywords,
        dataSource: 'database',
        lastUpdated: productData.updatedAt,
      };

      return NextResponse.json(enrichedProduct, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // 2. If not in database, find in static data and scrape
    const products = productsData as Product[];
    const staticProduct = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    if (!staticProduct || !staticProduct.url) {
      return NextResponse.json(
        { error: 'Product not found or URL not available' },
        { status: 404 }
      );
    }

    // 3. Scrape the product page
    const scrapedData = await scrapeTimcoProduct(staticProduct.url);

    if (!scrapedData) {
      // Fallback to static data only
      const fallbackProduct = {
        sku: staticProduct.sku,
        title: staticProduct.title,
        size: staticProduct.size,
        quantity: staticProduct.quantity,
        image: staticProduct.image,
        images: staticProduct.image ? [staticProduct.image] : [],
        specifications: {},
        availability: 'in_stock',
        isActive: true,
        isFeatured: false,
        stockQuantity: 0,
        minOrderQuantity: 1,
        dataSource: 'static',
        lastUpdated: new Date(),
      };

      return NextResponse.json(fallbackProduct, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      });
    }

    // 4. Store scraped data in database for future use
    try {
      await db.insert(product).values({
        sku: scrapedData.sku,
        title: scrapedData.title,
        description: scrapedData.description || null,
        price: scrapedData.price || null,
        originalPrice: null,
        size: staticProduct.size || null,
        quantity: staticProduct.quantity || null,
        category: scrapedData.category || null,
        image: staticProduct.image || null,
        images: scrapedData.images.length > 0 ? JSON.stringify(scrapedData.images) : null,
        specifications: Object.keys(scrapedData.specifications).length > 0 ? JSON.stringify(scrapedData.specifications) : null,
        availability: scrapedData.availability || 'in_stock',
        isActive: true,
        isFeatured: false,
        stockQuantity: 0, // Unknown for scraped products
        minOrderQuantity: 1,
        maxOrderQuantity: null,
        weight: null,
        dimensions: null,
        tags: null,
        seoTitle: null,
        seoDescription: null,
        metaKeywords: null,
      });
    } catch (dbError) {
      console.warn('Failed to store scraped product in database:', dbError);
      // Continue with returning scraped data even if DB storage fails
    }

    // 5. Return scraped data
    const enrichedProduct = {
      ...staticProduct,
      ...scrapedData,
      images: scrapedData.images.length > 0 ? scrapedData.images : (staticProduct.image ? [staticProduct.image] : []),
      isActive: true,
      isFeatured: false,
      stockQuantity: 0,
      minOrderQuantity: 1,
      dataSource: 'scraped',
      lastUpdated: new Date(),
    };

    return NextResponse.json(enrichedProduct, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('Error in product API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


