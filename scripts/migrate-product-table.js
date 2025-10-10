// Simple migration script using direct SQL
const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5rciZ2fWaeBD@ep-divine-haze-a10g72eb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

// Migration to add all new product fields
async function migrateProductTable() {
  try {
    console.log('🔄 Starting database migration...');
    await client.connect();
    
    // Add all new columns to the product table
    const columns = [
      // Additional fields from Excel file
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS summary TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS brand TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "group" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS type TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "subType" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "countryOfOrigin" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "ceMarked" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS barcode TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "commodityCode" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS intrastat TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packQuantity" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packQuantityUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packType" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "sellingUnit" TEXT',
      
      // Dimensions
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemLength" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemLengthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemWidth" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemWidthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemHeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "itemHeightUnit" TEXT',
      
      // Packaging dimensions
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingLength" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingLengthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingWidth" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingWidthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingHeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packagingHeightUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packageWeight" NUMERIC(10,3)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "packageWeightUnit" TEXT',
      
      // Material composition
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "paperWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "plasticWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "plasticRecycledContent" NUMERIC(5,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "woodWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "aluminumWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "steelWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "glassWeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "otherWeight" NUMERIC(10,2)',
      
      // Secondary packaging
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackaging" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingLength" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingLengthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingWidth" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingWidthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingHeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingHeightUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingWeight" NUMERIC(10,3)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "secondaryPackagingWeightUnit" TEXT',
      
      // Outer packaging
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackaging" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingLength" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingLengthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingWidth" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingWidthUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingHeight" NUMERIC(10,2)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingHeightUnit" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingWeight" NUMERIC(10,3)',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "outerPackagingWeightUnit" TEXT',
      
      // Shipping & storage
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "unNumber" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "unNumberDescription" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "ufiNumber" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "hazardousGoods" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "properShippingName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "containsLiquidContent" BOOLEAN',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS flammable BOOLEAN',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "ageVerificationRequired" BOOLEAN',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "expiryPeriodMonths" NUMERIC(5,2)',
      
      // Technical documents
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "dopCeFileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "dopCeFileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "dopUkcaFileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "dopUkcaFileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "docCeFileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "docCeFileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "docUkcaFileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "docUkcaFileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "sds1FileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "sds1FileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "sds2FileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "sds2FileLink" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "tdsFileName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "tdsFileLink" TEXT',
      
      // Web structure and SEO
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webStructure" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS keywords TEXT',
      
      // Images
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage1Name" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage1Link" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage2Name" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage2Link" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage3Name" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage3Link" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage4Name" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage4Link" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage5Name" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "webImage5Link" TEXT',
      
      // Brochure
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "brochurePageName" TEXT',
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "brochurePageLink" TEXT',
      
      // Date
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS "lastUpdated" TEXT',
      
      // Features (JSON array)
      'ALTER TABLE product ADD COLUMN IF NOT EXISTS features TEXT'
    ];
    
    console.log(`📝 Adding ${columns.length} new columns...`);
    
    for (let i = 0; i < columns.length; i++) {
      try {
        await client.query(columns[i]);
        console.log(`✅ Added column ${i + 1}/${columns.length}`);
      } catch (error) {
        console.log(`⚠️  Column ${i + 1} might already exist: ${error.message}`);
      }
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
migrateProductTable().then(() => {
  console.log('🏁 Migration script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Migration script failed:', error);
  process.exit(1);
});