import { db } from "./db";
import { product } from "./db/schema";
import { eq } from "drizzle-orm";
import { scrapeTimcoProduct } from "./scraper";
import productsData from "@/assets/products.json";

type StaticProduct = {
  id: string;
  sku: string;
  title: string;
  size?: string;
  quantity?: string;
  image?: string;
  url?: string;
  variants?: string;
};

type ScrapedProduct = {
  sku: string;
  title: string;
  description?: string;
  price?: string;
  images: string[];
  specifications: Record<string, string>;
  availability?: string;
  category?: string;
  breadcrumbs: string[];
  relatedProducts?: Array<{
    sku: string;
    title: string;
    image?: string;
    url: string;
  }>;
};

type AdminProduct = {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  price: string | null;
  originalPrice: string | null;
  size: string | null;
  quantity: string | null;
  category: string | null;
  image: string | null;
  images: string | null; // JSON string
  specifications: string | null; // JSON string
  availability: string | null;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number | null;
  minOrderQuantity: number | null;
  maxOrderQuantity: number | null;
  weight: string | null;
  dimensions: string | null; // JSON string
  tags: string | null; // JSON string
  seoTitle: string | null;
  seoDescription: string | null;
  metaKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ResolvedProduct = {
  // Core product info
  sku: string;
  title: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  size?: string;
  quantity?: string;
  category?: string;
  
  // Media
  image?: string;
  images: string[];
  
  // Specifications and details
  specifications: Record<string, string>;
  availability?: string;
  breadcrumbs: string[];
  relatedProducts?: Array<{
    sku: string;
    title: string;
    image?: string;
    url: string;
  }>;
  
  // Admin overrides
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  tags: string[];
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  
  // Data source info
  dataSource: 'admin' | 'scraped' | 'static';
  lastUpdated: Date;
};

export async function resolveProductData(sku: string): Promise<ResolvedProduct | null> {
  try {
    // 1. First, check if admin has overridden this product
    const adminProduct = await db
      .select()
      .from(product)
      .where(eq(product.sku, sku))
      .limit(1);

    if (adminProduct.length > 0) {
      const admin = adminProduct[0];
      return {
        sku: admin.sku,
        title: admin.title,
        description: admin.description || undefined,
        price: admin.price || undefined,
        originalPrice: admin.originalPrice || undefined,
        size: admin.size || undefined,
        quantity: admin.quantity || undefined,
        category: admin.category || undefined,
        image: admin.image || undefined,
        images: admin.images ? JSON.parse(admin.images) : [],
        specifications: admin.specifications ? JSON.parse(admin.specifications) : {},
        availability: admin.availability || undefined,
        breadcrumbs: [], // Admin products don't have breadcrumbs from scraping
        relatedProducts: undefined,
        isActive: admin.isActive,
        isFeatured: admin.isFeatured,
        stockQuantity: admin.stockQuantity || 0,
        minOrderQuantity: admin.minOrderQuantity || 1,
        maxOrderQuantity: admin.maxOrderQuantity || undefined,
        weight: admin.weight || undefined,
        dimensions: admin.dimensions ? JSON.parse(admin.dimensions) : undefined,
        tags: admin.tags ? JSON.parse(admin.tags) : [],
        seoTitle: admin.seoTitle || undefined,
        seoDescription: admin.seoDescription || undefined,
        metaKeywords: admin.metaKeywords || undefined,
        dataSource: 'admin',
        lastUpdated: admin.updatedAt,
      };
    }

    // 2. If no admin override, try to scrape live data
    const staticProducts = productsData as StaticProduct[];
    const staticProduct = staticProducts.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    if (staticProduct && staticProduct.url) {
      try {
        const scrapedData = await scrapeTimcoProduct(staticProduct.url);
        
        if (scrapedData) {
          return {
            sku: scrapedData.sku,
            title: scrapedData.title,
            description: scrapedData.description,
            price: scrapedData.price,
            originalPrice: undefined,
            size: staticProduct.size,
            quantity: staticProduct.quantity,
            category: scrapedData.category,
            image: staticProduct.image,
            images: scrapedData.images.length > 0 ? scrapedData.images : (staticProduct.image ? [staticProduct.image] : []),
            specifications: scrapedData.specifications,
            availability: scrapedData.availability,
            breadcrumbs: scrapedData.breadcrumbs,
            relatedProducts: scrapedData.relatedProducts,
            isActive: true, // Scraped products are always active
            isFeatured: false,
            stockQuantity: 0, // Unknown for scraped products
            minOrderQuantity: 1,
            maxOrderQuantity: undefined,
            weight: undefined,
            dimensions: undefined,
            tags: [],
            seoTitle: undefined,
            seoDescription: undefined,
            metaKeywords: undefined,
            dataSource: 'scraped',
            lastUpdated: new Date(),
          };
        }
      } catch (scrapeError) {
        console.warn(`Failed to scrape product ${sku}:`, scrapeError);
      }
    }

    // 3. Fallback to static data only
    if (staticProduct) {
      return {
        sku: staticProduct.sku,
        title: staticProduct.title,
        description: undefined,
        price: undefined,
        originalPrice: undefined,
        size: staticProduct.size,
        quantity: staticProduct.quantity,
        category: undefined,
        image: staticProduct.image,
        images: staticProduct.image ? [staticProduct.image] : [],
        specifications: {},
        availability: 'in_stock',
        breadcrumbs: [],
        relatedProducts: undefined,
        isActive: true,
        isFeatured: false,
        stockQuantity: 0,
        minOrderQuantity: 1,
        maxOrderQuantity: undefined,
        weight: undefined,
        dimensions: undefined,
        tags: [],
        seoTitle: undefined,
        seoDescription: undefined,
        metaKeywords: undefined,
        dataSource: 'static',
        lastUpdated: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error resolving product data:', error);
    return null;
  }
}

export async function getProductPrice(sku: string): Promise<string | null> {
  const product = await resolveProductData(sku);
  return product?.price || null;
}

export async function isProductActive(sku: string): Promise<boolean> {
  const product = await resolveProductData(sku);
  return product?.isActive || false;
}

export async function getProductStock(sku: string): Promise<number> {
  const product = await resolveProductData(sku);
  return product?.stockQuantity || 0;
}
