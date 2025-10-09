import * as XLSX from 'xlsx';
import { db } from './db';
import { product } from './db/schema';
import { eq } from 'drizzle-orm';

export interface ExcelProductRow {
  sku: string;
  title: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  size?: string;
  quantity?: string;
  category?: string;
  image?: string;
  images?: string; // Comma-separated URLs
  specifications?: string; // JSON string or key:value pairs
  availability?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string; // JSON string or "length,width,height"
  tags?: string; // Comma-separated tags
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    sku: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    sku: string;
    warning: string;
  }>;
}

export function parseExcelFile(buffer: Buffer): ExcelProductRow[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      blankrows: false 
    });

    if (jsonData.length < 2) {
      throw new Error('Excel file must have at least a header row and one data row');
    }

    // Get headers (first row)
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1) as any[][];

    // Map headers to our expected format
    const headerMap: Record<string, string> = {
      'SKU': 'sku',
      'Product Code': 'sku',
      'Product SKU': 'sku',
      'Title': 'title',
      'Product Name': 'title',
      'Name': 'title',
      'Description': 'description',
      'Price': 'price',
      'Selling Price': 'price',
      'Original Price': 'originalPrice',
      'MSRP': 'originalPrice',
      'Size': 'size',
      'Quantity': 'quantity',
      'Package Quantity': 'quantity',
      'Category': 'category',
      'Product Category': 'category',
      'Image': 'image',
      'Main Image': 'image',
      'Images': 'images',
      'Product Images': 'images',
      'Specifications': 'specifications',
      'Specs': 'specifications',
      'Availability': 'availability',
      'Stock Status': 'availability',
      'Active': 'isActive',
      'Is Active': 'isActive',
      'Featured': 'isFeatured',
      'Is Featured': 'isFeatured',
      'Stock Quantity': 'stockQuantity',
      'Inventory': 'stockQuantity',
      'Min Order': 'minOrderQuantity',
      'Min Order Quantity': 'minOrderQuantity',
      'Max Order': 'maxOrderQuantity',
      'Max Order Quantity': 'maxOrderQuantity',
      'Weight': 'weight',
      'Weight (kg)': 'weight',
      'Dimensions': 'dimensions',
      'Size (cm)': 'dimensions',
      'Tags': 'tags',
      'SEO Title': 'seoTitle',
      'Meta Title': 'seoTitle',
      'SEO Description': 'seoDescription',
      'Meta Description': 'seoDescription',
      'Keywords': 'metaKeywords',
      'Meta Keywords': 'metaKeywords',
    };

    // Convert data rows to objects
    const products: ExcelProductRow[] = dataRows.map((row, index) => {
      const product: any = {};
      
      headers.forEach((header, colIndex) => {
        const mappedKey = headerMap[header.trim()];
        if (mappedKey && row[colIndex] !== undefined && row[colIndex] !== '') {
          let value = row[colIndex];
          
          // Type conversion based on field
          if (mappedKey === 'price' || mappedKey === 'originalPrice' || mappedKey === 'weight') {
            value = parseFloat(value) || 0;
          } else if (mappedKey === 'stockQuantity' || mappedKey === 'minOrderQuantity' || mappedKey === 'maxOrderQuantity') {
            value = parseInt(value) || 0;
          } else if (mappedKey === 'isActive' || mappedKey === 'isFeatured') {
            value = Boolean(value) && value !== 'false' && value !== '0' && value !== 'no';
          } else if (typeof value === 'string') {
            value = value.toString().trim();
          }
          
          product[mappedKey] = value;
        }
      });
      
      return product;
    });

    return products;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateProductData(products: ExcelProductRow[]): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
    warnings: [],
  };

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const rowNumber = i + 2; // +2 because Excel rows start at 1 and we skip header

    // Required fields validation
    if (!product.sku || product.sku.trim() === '') {
      result.errors.push({
        row: rowNumber,
        sku: product.sku || 'N/A',
        error: 'SKU is required',
      });
      result.failed++;
      continue;
    }

    if (!product.title || product.title.trim() === '') {
      result.errors.push({
        row: rowNumber,
        sku: product.sku,
        error: 'Title is required',
      });
      result.failed++;
      continue;
    }

    // Check for duplicate SKUs in the import
    const duplicateInImport = products.slice(0, i).find(p => p.sku === product.sku);
    if (duplicateInImport) {
      result.errors.push({
        row: rowNumber,
        sku: product.sku,
        error: 'Duplicate SKU in import file',
      });
      result.failed++;
      continue;
    }

    // Check if SKU already exists in database
    try {
      const existingProduct = await db
        .select()
        .from(product)
        .where(eq(product.sku, product.sku))
        .limit(1);

      if (existingProduct.length > 0) {
        result.warnings.push({
          row: rowNumber,
          sku: product.sku,
          warning: 'Product already exists in database (will be updated)',
        });
      }
    } catch (error) {
      result.warnings.push({
        row: rowNumber,
        sku: product.sku,
        warning: 'Could not check for existing product',
      });
    }

    // Price validation
    if (product.price !== undefined && (product.price < 0 || isNaN(product.price))) {
      result.warnings.push({
        row: rowNumber,
        sku: product.sku,
        warning: 'Invalid price value',
      });
    }

    // Stock quantity validation
    if (product.stockQuantity !== undefined && (product.stockQuantity < 0 || isNaN(product.stockQuantity))) {
      result.warnings.push({
        row: rowNumber,
        sku: product.sku,
        warning: 'Invalid stock quantity value',
      });
    }

    result.success++;
  }

  return result;
}

export async function importProductsToDatabase(products: ExcelProductRow[]): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
    warnings: [],
  };

  for (let i = 0; i < products.length; i++) {
    const productData = products[i];
    const rowNumber = i + 2;

    try {
      // Check if product exists
      const existingProduct = await db
        .select()
        .from(product)
        .where(eq(product.sku, productData.sku))
        .limit(1);

      const productRecord = {
        sku: productData.sku,
        title: productData.title,
        description: productData.description || null,
        price: productData.price ? productData.price.toString() : null,
        originalPrice: productData.originalPrice ? productData.originalPrice.toString() : null,
        size: productData.size || null,
        quantity: productData.quantity || null,
        category: productData.category || null,
        image: productData.image || null,
        images: productData.images ? JSON.stringify(productData.images.split(',').map(img => img.trim())) : null,
        specifications: productData.specifications ? JSON.stringify(parseSpecifications(productData.specifications)) : null,
        availability: productData.availability || 'in_stock',
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        isFeatured: productData.isFeatured || false,
        stockQuantity: productData.stockQuantity || 0,
        minOrderQuantity: productData.minOrderQuantity || 1,
        maxOrderQuantity: productData.maxOrderQuantity || null,
        weight: productData.weight ? productData.weight.toString() : null,
        dimensions: productData.dimensions ? JSON.stringify(parseDimensions(productData.dimensions)) : null,
        tags: productData.tags ? JSON.stringify(productData.tags.split(',').map(tag => tag.trim())) : null,
        seoTitle: productData.seoTitle || null,
        seoDescription: productData.seoDescription || null,
        metaKeywords: productData.metaKeywords || null,
        updatedAt: new Date(),
      };

      if (existingProduct.length > 0) {
        // Update existing product
        await db
          .update(product)
          .set(productRecord)
          .where(eq(product.sku, productData.sku));
      } else {
        // Insert new product
        await db.insert(product).values({
          ...productRecord,
          createdAt: new Date(),
        });
      }

      result.success++;
    } catch (error) {
      result.errors.push({
        row: rowNumber,
        sku: productData.sku,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      result.failed++;
    }
  }

  return result;
}

function parseSpecifications(specs: string): Record<string, string> {
  try {
    // Try to parse as JSON first
    return JSON.parse(specs);
  } catch {
    // If not JSON, try to parse as key:value pairs
    const specifications: Record<string, string> = {};
    const pairs = specs.split(',').map(pair => pair.trim());
    
    for (const pair of pairs) {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        specifications[key] = value;
      }
    }
    
    return specifications;
  }
}

function parseDimensions(dimensions: string): { length: string; width: string; height: string } {
  try {
    // Try to parse as JSON first
    return JSON.parse(dimensions);
  } catch {
    // If not JSON, try to parse as "length,width,height"
    const parts = dimensions.split(',').map(s => s.trim());
    return {
      length: parts[0] || '',
      width: parts[1] || '',
      height: parts[2] || '',
    };
  }
}
