const XLSX = require('xlsx');
const path = require('path');
const { Client } = require('pg');
const { createId } = require('@paralleldrive/cuid2');

// Field mapping from Excel columns to database fields
const fieldMapping = {
  // Core product fields
  'TIMCO Item Code': 'sku',
  'Short Description': 'title',
  'Long Description': 'description',
  'Product Summary': 'summary',
  'Size': 'size',
  'List Price': 'price',
  'NET': 'netPrice',
  'Brand': 'brand',
  'Group': 'group',
  'Type': 'type',
  'Sub Type': 'subType',
  'Country of Origin': 'countryOfOrigin',
  'CE UKCA Marked': 'ceMarked',
  'Barcode': 'barcode',
  'Commodity Code': 'commodityCode',
  'Intrastat': 'intrastat',
  'MOQ': 'minOrderQuantity',
  'Pack Qty': 'packQuantity',
  'Pack Qty Unit': 'packQuantityUnit',
  'Pack Type': 'packType',
  'Selling Unit': 'sellingUnit',
  
  // Dimensions
  'Item Length': 'itemLength',
  'Item Length Unit': 'itemLengthUnit',
  'Item Width': 'itemWidth',
  'Item Width Unit': 'itemWidthUnit',
  'Item Height': 'itemHeight',
  'Item Height Unit': 'itemHeightUnit',
  
  // Packaging dimensions
  'Item Packaging Length': 'packagingLength',
  'Item Packaging Length Unit': 'packagingLengthUnit',
  'Item Packaging Width': 'packagingWidth',
  'Item Packaging Width Unit': 'packagingWidthUnit',
  'Item Packaging Height': 'packagingHeight',
  'Item Packaging Height Unit': 'packagingHeightUnit',
  'Item Package Weight': 'packageWeight',
  'Item Package Weight Unit': 'packageWeightUnit',
  
  // Material composition
  'Paper g': 'paperWeight',
  'Plastic g': 'plasticWeight',
  'Plastic Recycled Content %': 'plasticRecycledContent',
  'Wood g': 'woodWeight',
  'Alum g': 'aluminumWeight',
  'Steel g': 'steelWeight',
  'Glass g': 'glassWeight',
  'Other g': 'otherWeight',
  
  // Secondary packaging
  'Secondary': 'secondaryPackaging',
  'Secondary Packaging Length': 'secondaryPackagingLength',
  'Secondary Packaging Length Unit': 'secondaryPackagingLengthUnit',
  'Secondary Packaging Width': 'secondaryPackagingWidth',
  'Secondary Packaging Width Unit': 'secondaryPackagingWidthUnit',
  'Secondary Packaging Height': 'secondaryPackagingHeight',
  'Secondary Packaging Height Unit': 'secondaryPackagingHeightUnit',
  'Secondary Packaging Weight': 'secondaryPackagingWeight',
  'Secondary Packaging Weight Unit': 'secondaryPackagingWeightUnit',
  
  // Outer packaging
  'Outer': 'outerPackaging',
  'Outer Packaging Length': 'outerPackagingLength',
  'Outer Packaging Length Unit': 'outerPackagingLengthUnit',
  'Outer Packaging Width': 'outerPackagingWidth',
  'Outer Packaging Width Unit': 'outerPackagingWidthUnit',
  'Outer Packaging Height': 'outerPackagingHeight',
  'Outer Packaging Height Unit': 'outerPackagingHeightUnit',
  'Outer Packaging Weight': 'outerPackagingWeight',
  'Outer Packaging Weight Unit': 'outerPackagingWeightUnit',
  
  // Shipping & storage
  'UN Number': 'unNumber',
  'UN Number Description': 'unNumberDescription',
  'UFI Number': 'ufiNumber',
  'Hazardous Goods': 'hazardousGoods',
  'Proper Shipping Name': 'properShippingName',
  'Contains Liquid Content ': 'containsLiquidContent',
  'Flammable': 'flammable',
  'Age Verification Required': 'ageVerificationRequired',
  'Expiry Period Months': 'expiryPeriodMonths',
  
  // Technical documents
  'DOP CE File Name': 'dopCeFileName',
  'DOP CE File Link': 'dopCeFileLink',
  'DOP UKCA File Name': 'dopUkcaFileName',
  'DOP UKCA File Link': 'dopUkcaFileLink',
  'DOC CE File Name': 'docCeFileName',
  'DOC CE File Link': 'docCeFileLink',
  'DOC UKCA File Name': 'docUkcaFileName',
  'DOC UKCA File Link': 'docUkcaFileLink',
  'SDS 1 File Name': 'sds1FileName',
  'SDS 1 File Link': 'sds1FileLink',
  'SDS 2 File Name': 'sds2FileName',
  'SDS 2 File Link': 'sds2FileLink',
  'TDS File Name': 'tdsFileName',
  'TDS File Link': 'tdsFileLink',
  
  // Web structure and SEO
  'Web Structure': 'webStructure',
  'Keywords': 'keywords',
  
  // Images
  'Web Image 1 Name': 'webImage1Name',
  'Web Image 1 Link': 'webImage1Link',
  'Web Image 2 Name': 'webImage2Name',
  'Web Image 2 Link': 'webImage2Link',
  'Web Image 3 Name': 'webImage3Name',
  'Web Image 3 Link': 'webImage3Link',
  'Web Image 4 Name': 'webImage4Name',
  'Web Image 4 Link': 'webImage4Link',
  'Web Image 5 Name': 'webImage5Name',
  'Web Image 5 Link': 'webImage5Link',
  
  // Brochure
  'Brochure Page Name': 'brochurePageName',
  'Brochure Page Link': 'brochurePageLink',
  
  // Date
  'Date': 'lastUpdated'
};

// Function to clean and validate data
function cleanValue(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // Convert to string and trim
  const strValue = String(value).trim();
  
  // Handle "N/A" values
  if (strValue === 'N/A' || strValue === 'n/a') {
    return null;
  }
  
  return strValue;
}

// Function to parse numeric values
function parseNumeric(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) return null;
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

// Function to parse boolean values
function parseBoolean(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) return null;
  
  const lower = cleaned.toLowerCase();
  if (lower === 'yes' || lower === 'true' || lower === '1') return true;
  if (lower === 'no' || lower === 'false' || lower === '0') return false;
  return null;
}

// Function to create specifications object from attributes
function createSpecifications(row) {
  const specs = {};
  
  for (let i = 1; i <= 10; i++) {
    const titleKey = `Attribute ${i} Title`;
    const resultKey = `Attribute ${i} Result`;
    
    const title = cleanValue(row[titleKey]);
    const result = cleanValue(row[resultKey]);
    
    if (title && result) {
      specs[title] = result;
    }
  }
  
  return Object.keys(specs).length > 0 ? JSON.stringify(specs) : null;
}

// Function to create features array
function createFeatures(row) {
  const features = [];
  
  for (let i = 1; i <= 10; i++) {
    const featureKey = `Feature ${i}`;
    const feature = cleanValue(row[featureKey]);
    
    if (feature) {
      features.push(feature);
    }
  }
  
  return features.length > 0 ? JSON.stringify(features) : null;
}

// Function to create images array
function createImages(row) {
  const images = [];
  
  for (let i = 1; i <= 5; i++) {
    const imageLinkKey = `Web Image ${i} Link`;
    const imageLink = cleanValue(row[imageLinkKey]);
    
    if (imageLink) {
      images.push(imageLink);
    }
  }
  
  return images.length > 0 ? JSON.stringify(images) : null;
}

// Function to process a single product row
function processProductRow(row) {
  const productData = {
    // Core required fields
    sku: cleanValue(row['TIMCO Item Code']),
    title: cleanValue(row['Short Description']),
    description: cleanValue(row['Long Description']),
    price: parseNumeric(row['List Price']),
    originalPrice: parseNumeric(row['NET']),
    category: cleanValue(row['Group']) || cleanValue(row['Type']),
    isActive: true,
    isFeatured: false,
    
    // Additional fields
    summary: cleanValue(row['Product Summary']),
    size: cleanValue(row['Size']),
    brand: cleanValue(row['Brand']),
    group: cleanValue(row['Group']),
    type: cleanValue(row['Type']),
    subType: cleanValue(row['Sub Type']),
    countryOfOrigin: cleanValue(row['Country of Origin']),
    ceMarked: cleanValue(row['CE UKCA Marked']),
    barcode: cleanValue(row['Barcode']),
    commodityCode: cleanValue(row['Commodity Code']),
    intrastat: cleanValue(row['Intrastat']),
    minOrderQuantity: parseNumeric(row['MOQ']),
    packQuantity: parseNumeric(row['Pack Qty']),
    packQuantityUnit: cleanValue(row['Pack Qty Unit']),
    packType: cleanValue(row['Pack Type']),
    sellingUnit: cleanValue(row['Selling Unit']),
    
    // Dimensions
    itemLength: parseNumeric(row['Item Length']),
    itemLengthUnit: cleanValue(row['Item Length Unit']),
    itemWidth: parseNumeric(row['Item Width']),
    itemWidthUnit: cleanValue(row['Item Width Unit']),
    itemHeight: parseNumeric(row['Item Height']),
    itemHeightUnit: cleanValue(row['Item Height Unit']),
    
    // Packaging dimensions
    packagingLength: parseNumeric(row['Item Packaging Length']),
    packagingLengthUnit: cleanValue(row['Item Packaging Length Unit']),
    packagingWidth: parseNumeric(row['Item Packaging Width']),
    packagingWidthUnit: cleanValue(row['Item Packaging Width Unit']),
    packagingHeight: parseNumeric(row['Item Packaging Height']),
    packagingHeightUnit: cleanValue(row['Item Packaging Height Unit']),
    packageWeight: parseNumeric(row['Item Package Weight']),
    packageWeightUnit: cleanValue(row['Item Package Weight Unit']),
    
    // Material composition
    paperWeight: parseNumeric(row['Paper g']),
    plasticWeight: parseNumeric(row['Plastic g']),
    plasticRecycledContent: parseNumeric(row['Plastic Recycled Content %']),
    woodWeight: parseNumeric(row['Wood g']),
    aluminumWeight: parseNumeric(row['Alum g']),
    steelWeight: parseNumeric(row['Steel g']),
    glassWeight: parseNumeric(row['Glass g']),
    otherWeight: parseNumeric(row['Other g']),
    
    // Secondary packaging
    secondaryPackaging: cleanValue(row['Secondary']),
    secondaryPackagingLength: parseNumeric(row['Secondary Packaging Length']),
    secondaryPackagingLengthUnit: cleanValue(row['Secondary Packaging Length Unit']),
    secondaryPackagingWidth: parseNumeric(row['Secondary Packaging Width']),
    secondaryPackagingWidthUnit: cleanValue(row['Secondary Packaging Width Unit']),
    secondaryPackagingHeight: parseNumeric(row['Secondary Packaging Height']),
    secondaryPackagingHeightUnit: cleanValue(row['Secondary Packaging Height Unit']),
    secondaryPackagingWeight: parseNumeric(row['Secondary Packaging Weight']),
    secondaryPackagingWeightUnit: cleanValue(row['Secondary Packaging Weight Unit']),
    
    // Outer packaging
    outerPackaging: cleanValue(row['Outer']),
    outerPackagingLength: parseNumeric(row['Outer Packaging Length']),
    outerPackagingLengthUnit: cleanValue(row['Outer Packaging Length Unit']),
    outerPackagingWidth: parseNumeric(row['Outer Packaging Width']),
    outerPackagingWidthUnit: cleanValue(row['Outer Packaging Width Unit']),
    outerPackagingHeight: parseNumeric(row['Outer Packaging Height']),
    outerPackagingHeightUnit: cleanValue(row['Outer Packaging Height Unit']),
    outerPackagingWeight: parseNumeric(row['Outer Packaging Weight']),
    outerPackagingWeightUnit: cleanValue(row['Outer Packaging Weight Unit']),
    
    // Shipping & storage
    unNumber: cleanValue(row['UN Number']),
    unNumberDescription: cleanValue(row['UN Number Description']),
    ufiNumber: cleanValue(row['UFI Number']),
    hazardousGoods: cleanValue(row['Hazardous Goods']),
    properShippingName: cleanValue(row['Proper Shipping Name']),
    containsLiquidContent: parseBoolean(row['Contains Liquid Content ']),
    flammable: parseBoolean(row['Flammable']),
    ageVerificationRequired: parseBoolean(row['Age Verification Required']),
    expiryPeriodMonths: parseNumeric(row['Expiry Period Months']),
    
    // Technical documents
    dopCeFileName: cleanValue(row['DOP CE File Name']),
    dopCeFileLink: cleanValue(row['DOP CE File Link']),
    dopUkcaFileName: cleanValue(row['DOP UKCA File Name']),
    dopUkcaFileLink: cleanValue(row['DOP UKCA File Link']),
    docCeFileName: cleanValue(row['DOC CE File Name']),
    docCeFileLink: cleanValue(row['DOC CE File Link']),
    docUkcaFileName: cleanValue(row['DOC UKCA File Name']),
    docUkcaFileLink: cleanValue(row['DOC UKCA File Link']),
    sds1FileName: cleanValue(row['SDS 1 File Name']),
    sds1FileLink: cleanValue(row['SDS 1 File Link']),
    sds2FileName: cleanValue(row['SDS 2 File Name']),
    sds2FileLink: cleanValue(row['SDS 2 File Link']),
    tdsFileName: cleanValue(row['TDS File Name']),
    tdsFileLink: cleanValue(row['TDS File Link']),
    
    // Web structure and SEO
    webStructure: cleanValue(row['Web Structure']),
    keywords: cleanValue(row['Keywords']),
    
    // Images
    webImage1Name: cleanValue(row['Web Image 1 Name']),
    webImage1Link: cleanValue(row['Web Image 1 Link']),
    webImage2Name: cleanValue(row['Web Image 2 Name']),
    webImage2Link: cleanValue(row['Web Image 2 Link']),
    webImage3Name: cleanValue(row['Web Image 3 Name']),
    webImage3Link: cleanValue(row['Web Image 3 Link']),
    webImage4Name: cleanValue(row['Web Image 4 Name']),
    webImage4Link: cleanValue(row['Web Image 4 Link']),
    webImage5Name: cleanValue(row['Web Image 5 Name']),
    webImage5Link: cleanValue(row['Web Image 5 Link']),
    
    // Brochure
    brochurePageName: cleanValue(row['Brochure Page Name']),
    brochurePageLink: cleanValue(row['Brochure Page Link']),
    
    // Date
    lastUpdated: cleanValue(row['Date']),
    
    // JSON fields
    specifications: createSpecifications(row),
    features: createFeatures(row),
    images: createImages(row),
    
    // Set primary image from first web image
    image: cleanValue(row['Web Image 1 Link'])
  };
  
  // Remove null/undefined values to keep the object clean
  Object.keys(productData).forEach(key => {
    if (productData[key] === null || productData[key] === undefined) {
      delete productData[key];
    }
  });
  
  return productData;
}

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5rciZ2fWaeBD@ep-divine-haze-a10g72eb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

// Function to generate SQL insert/update query
function generateProductSQL(productData, isUpdate = false) {
  const fields = Object.keys(productData);
  const values = Object.values(productData);
  
  if (isUpdate) {
    const setClause = fields.map(field => `"${field}" = $${fields.indexOf(field) + 1}`).join(', ');
    return {
      query: `UPDATE product SET ${setClause}, "updatedAt" = NOW() WHERE sku = $${fields.length + 1}`,
      values: [...values, productData.sku]
    };
  } else {
    // Add ID for new products
    const id = createId();
    const fieldsWithId = ['id', ...fields];
    const valuesWithId = [id, ...values];
    const fieldNames = fieldsWithId.map(field => `"${field}"`).join(', ');
    const placeholders = fieldsWithId.map((_, index) => `$${index + 1}`).join(', ');
    return {
      query: `INSERT INTO product (${fieldNames}, "createdAt", "updatedAt") VALUES (${placeholders}, NOW(), NOW())`,
      values: valuesWithId
    };
  }
}

// Main function to upload products
async function uploadProducts() {
  try {
    console.log('🚀 Starting product upload process...');
    await client.connect();
    
    const filePath = path.join(__dirname, '../public/products.xlsx');
    console.log('📁 Reading Excel file:', filePath);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Find the header row
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row[0] && typeof row[0] === 'string' && row[0].includes('TIMCO Item Code')) {
        headerRowIndex = i;
        break;
      }
    }
    
    const headers = jsonData[headerRowIndex];
    const dataRows = jsonData.slice(headerRowIndex + 1);
    
    console.log(`📊 Found ${dataRows.length} products to process`);
    
    // Process products in batches
    const batchSize = 25; // Smaller batch size for better memory management
    let processed = 0;
    let errors = 0;
    
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = dataRows.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dataRows.length / batchSize)}`);
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        const rowData = {};
        
        // Map row data to headers
        headers.forEach((header, index) => {
          if (header && header.trim()) {
            rowData[header] = row[index];
          }
        });
        
        try {
          const productData = processProductRow(rowData);
          
          if (!productData.sku) {
            console.log(`⚠️  Skipping row ${i + j + 1}: No SKU found`);
            continue;
          }
          
          // Check if product already exists
          const existingResult = await client.query('SELECT id FROM product WHERE sku = $1', [productData.sku]);
          
          if (existingResult.rows.length > 0) {
            console.log(`🔄 Updating existing product: ${productData.sku}`);
            const { query, values } = generateProductSQL(productData, true);
            await client.query(query, values);
          } else {
            console.log(`➕ Creating new product: ${productData.sku}`);
            const { query, values } = generateProductSQL(productData, false);
            await client.query(query, values);
          }
          
          processed++;
          
          if (processed % 100 === 0) {
            console.log(`✅ Processed ${processed} products so far...`);
          }
          
        } catch (error) {
          console.error(`❌ Error processing row ${i + j + 1}:`, error.message);
          errors++;
        }
      }
      
      // Small delay between batches to avoid overwhelming the database
      if (i + batchSize < dataRows.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('\n🎉 Upload process completed!');
    console.log(`✅ Successfully processed: ${processed} products`);
    console.log(`❌ Errors encountered: ${errors} products`);
    
  } catch (error) {
    console.error('💥 Fatal error during upload:', error);
  } finally {
    await client.end();
  }
}

// Run the upload
uploadProducts().then(() => {
  console.log('🏁 Script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
