import { NextRequest, NextResponse } from 'next/server';
import { scrapeTimcoProduct } from '@/lib/scraper';
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

    // Find product in our local data
    const products = productsData as Product[];
    const product = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    if (!product || !product.url) {
      return NextResponse.json(
        { error: 'Product not found or URL not available' },
        { status: 404 }
      );
    }

    // Scrape the product page
    const scrapedData = await scrapeTimcoProduct(product.url);

    if (!scrapedData) {
      return NextResponse.json(
        { error: 'Failed to scrape product data' },
        { status: 500 }
      );
    }

    // Merge local data with scraped data
    const enrichedProduct = {
      ...product,
      ...scrapedData,
      // Keep original image as fallback
      images: scrapedData.images.length > 0 ? scrapedData.images : (product.image ? [product.image] : []),
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


