import { NextRequest, NextResponse } from "next/server";
import { parseExcelFile, validateProductData, importProductsToDatabase } from "@/lib/excel-parser";

// Configure for large file uploads
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout for large file processing

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file." },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer with progress tracking
    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
    
    let buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      console.log(`File converted to buffer, size: ${buffer.length} bytes`);
    } catch (error) {
      console.error("Error converting file to buffer:", error);
      return NextResponse.json(
        { error: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Parse Excel file
    let products;
    try {
      console.log("Starting Excel file parsing...");
      products = parseExcelFile(buffer);
      console.log(`Parsed ${products.length} products from Excel file`);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      return NextResponse.json(
        { error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found in the Excel file" },
        { status: 400 }
      );
    }

    // Validate product data
    const validationResult = await validateProductData(products);

    // If there are critical errors, return validation results without importing
    if (validationResult.failed > 0) {
      return NextResponse.json({
        success: false,
        message: "Validation failed. Please fix the errors and try again.",
        validation: validationResult,
      }, { status: 400 });
    }

    // Import products to database
    const importResult = await importProductsToDatabase(products);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importResult.success} products`,
      import: importResult,
      validation: validationResult,
    });

  } catch (error) {
    console.error("Error importing products:", error);
    return NextResponse.json(
      { error: "Failed to import products" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin authentication is handled by the layout

    // Return Excel template information
    const templateInfo = {
      requiredColumns: [
        'SKU',
        'Title',
        'Description',
        'Price',
        'Category',
      ],
      optionalColumns: [
        'Original Price',
        'Size',
        'Quantity',
        'Image',
        'Images',
        'Specifications',
        'Availability',
        'Active',
        'Featured',
        'Stock Quantity',
        'Min Order Quantity',
        'Max Order Quantity',
        'Weight',
        'Dimensions',
        'Tags',
        'SEO Title',
        'SEO Description',
        'Keywords',
      ],
      examples: {
        SKU: '35012C2',
        Title: 'C2 Strong-Fix - PZ - Double Countersunk - Sharp Point - Yellow',
        Description: 'High-quality construction screw...',
        Price: 15.99,
        Category: 'Screws',
        'Original Price': 19.99,
        Size: '3.5 x 12',
        Quantity: 'Box : 200',
        Image: 'https://example.com/image.jpg',
        Images: 'https://example.com/img1.jpg,https://example.com/img2.jpg',
        Specifications: '{"Material":"Steel","Finish":"Yellow Zinc","Head Type":"Countersunk"}',
        Availability: 'in_stock',
        Active: true,
        Featured: false,
        'Stock Quantity': 100,
        'Min Order Quantity': 1,
        'Max Order Quantity': 1000,
        Weight: 0.5,
        Dimensions: '{"length":"3.5","width":"12","height":"0.5"}',
        Tags: 'construction,screws,fasteners',
        'SEO Title': 'C2 Strong-Fix Screw - 3.5x12mm - Yellow Zinc',
        'SEO Description': 'High-quality construction screw for professional use...',
        Keywords: 'screw,construction,fastener,steel',
      },
      notes: [
        'SKU and Title are required fields',
        'Images should be comma-separated URLs',
        'Specifications can be JSON format or key:value pairs separated by commas',
        'Dimensions should be JSON format or length,width,height separated by commas',
        'Tags should be comma-separated',
        'Boolean values (Active, Featured) can be true/false, 1/0, yes/no',
        'Price and Weight should be numeric values',
        'Stock quantities should be whole numbers',
      ],
    };

    return NextResponse.json(templateInfo);
  } catch (error) {
    console.error("Error getting template info:", error);
    return NextResponse.json(
      { error: "Failed to get template information" },
      { status: 500 }
    );
  }
}
