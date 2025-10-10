import { NextRequest, NextResponse } from "next/server";
import { parseExcelFile, validateProductData, importProductsToDatabase } from "@/lib/excel-parser";

// Configure for chunked uploads
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string || '0');
    const totalChunks = parseInt(formData.get('totalChunks') as string || '1');

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type - check both MIME type and file extension
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/octet-stream', // Sometimes Excel files have this MIME type
      'application/zip' // .xlsx files are actually ZIP files
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      console.log(`File type validation failed. MIME type: ${file.type}, File name: ${file.name}`);
      return NextResponse.json(
        { error: `Invalid file type. Detected MIME type: ${file.type}. Please upload an Excel file (.xlsx, .xls) or CSV file.` },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB per chunk)
    const maxSize = 2 * 1024 * 1024; // 2MB per chunk
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Chunk too large. Maximum size per chunk is 2MB." },
        { status: 400 }
      );
    }

    console.log(`Processing chunk ${chunkIndex + 1}/${totalChunks}: ${file.name}, size: ${file.size} bytes`);

    // Convert file to buffer
    let buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      (arrayBuffer as any) = null; // Free memory
    } catch (error) {
      console.error("Error converting chunk to buffer:", error);
      return NextResponse.json(
        { error: `Failed to process chunk: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Parse Excel file
    let products;
    try {
      products = parseExcelFile(buffer);
      buffer = null as any; // Free memory
    } catch (error) {
      console.error("Error parsing chunk:", error);
      return NextResponse.json(
        { error: `Failed to parse chunk: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Chunk ${chunkIndex + 1} processed successfully (no products found)`,
        chunkIndex,
        totalChunks,
        productsProcessed: 0,
        import: { success: 0, failed: 0, errors: [], warnings: [] }
      });
    }

    // Validate products
    const validationResult = validateProductData(products);
    if (validationResult.failed > 0) {
      return NextResponse.json({
        success: false,
        message: `Chunk ${chunkIndex + 1} validation failed`,
        chunkIndex,
        totalChunks,
        validation: validationResult
      }, { status: 400 });
    }

    // Import products to database
    console.log(`Importing ${products.length} products from chunk ${chunkIndex + 1}...`);
    const importResult = await importProductsToDatabase(products);

    // Force garbage collection
    if (global.gc) {
      global.gc();
    }

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1} processed successfully`,
      chunkIndex,
      totalChunks,
      productsProcessed: products.length,
      import: importResult,
      validation: validationResult
    });

  } catch (error) {
    console.error("Error processing chunk:", error);
    return NextResponse.json(
      { error: "Failed to process chunk" },
      { status: 500 }
    );
  }
}
