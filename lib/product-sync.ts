import { db } from "./db";
import { product } from "./db/schema";
import { eq, and, lt } from "drizzle-orm";
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

export async function syncProductFromScraping(sku: string): Promise<boolean> {
  try {
    // Find product in static data
    const staticProducts = productsData as StaticProduct[];
    const staticProduct = staticProducts.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    if (!staticProduct || !staticProduct.url) {
      console.warn(`Product ${sku} not found in static data or no URL available`);
      return false;
    }

    // Scrape the product page
    const scrapedData = await scrapeTimcoProduct(staticProduct.url);

    if (!scrapedData) {
      console.warn(`Failed to scrape product ${sku}`);
      return false;
    }

    // Check if product already exists in database
    const existingProduct = await db
      .select()
      .from(product)
      .where(eq(product.sku, sku))
      .limit(1);

    if (existingProduct.length > 0) {
      // Update existing product
      await db
        .update(product)
        .set({
          title: scrapedData.title,
          description: scrapedData.description || null,
          price: scrapedData.price || null,
          category: scrapedData.category || null,
          images: scrapedData.images.length > 0 ? JSON.stringify(scrapedData.images) : null,
          specifications: Object.keys(scrapedData.specifications).length > 0 ? JSON.stringify(scrapedData.specifications) : null,
          availability: scrapedData.availability || 'in_stock',
          updatedAt: new Date(),
        })
        .where(eq(product.sku, sku));

      console.log(`Updated product ${sku} from scraping`);
    } else {
      // Insert new product
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
        stockQuantity: 0,
        minOrderQuantity: 1,
        maxOrderQuantity: null,
        weight: null,
        dimensions: null,
        tags: null,
        seoTitle: null,
        seoDescription: null,
        metaKeywords: null,
      });

      console.log(`Created product ${sku} from scraping`);
    }

    return true;
  } catch (error) {
    console.error(`Error syncing product ${sku}:`, error);
    return false;
  }
}

export async function syncAllProducts(): Promise<{ success: number; failed: number; total: number }> {
  const staticProducts = productsData as StaticProduct[];
  let success = 0;
  let failed = 0;
  const total = staticProducts.length;

  console.log(`Starting sync of ${total} products...`);

  for (const staticProduct of staticProducts) {
    if (staticProduct.url) {
      const result = await syncProductFromScraping(staticProduct.sku);
      if (result) {
        success++;
      } else {
        failed++;
      }
      
      // Add small delay to avoid overwhelming the target server
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      failed++;
    }
  }

  console.log(`Sync completed: ${success} success, ${failed} failed, ${total} total`);
  return { success, failed, total };
}

export async function syncStaleProducts(hoursOld: number = 24): Promise<{ success: number; failed: number; total: number }> {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hoursOld);

  // Get products that haven't been updated recently
  const staleProducts = await db
    .select()
    .from(product)
    .where(lt(product.updatedAt, cutoffTime));

  let success = 0;
  let failed = 0;
  const total = staleProducts.length;

  console.log(`Syncing ${total} stale products (older than ${hoursOld} hours)...`);

  for (const dbProduct of staleProducts) {
    const result = await syncProductFromScraping(dbProduct.sku);
    if (result) {
      success++;
    } else {
      failed++;
    }
    
    // Add small delay to avoid overwhelming the target server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Stale sync completed: ${success} success, ${failed} failed, ${total} total`);
  return { success, failed, total };
}

export async function getProductSyncStatus(): Promise<{
  totalInDatabase: number;
  totalInStatic: number;
  recentlyUpdated: number;
  staleProducts: number;
}> {
  const staticProducts = productsData as StaticProduct[];
  const totalInStatic = staticProducts.length;

  const allDbProducts = await db.select().from(product);
  const totalInDatabase = allDbProducts.length;

  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const recentlyUpdated = allDbProducts.filter(
    p => p.updatedAt > oneDayAgo
  ).length;

  const staleProducts = allDbProducts.filter(
    p => p.updatedAt < oneDayAgo
  ).length;

  return {
    totalInDatabase,
    totalInStatic,
    recentlyUpdated,
    staleProducts,
  };
}
