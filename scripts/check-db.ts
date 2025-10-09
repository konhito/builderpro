import { db } from '../lib/db';
import { product, user } from '../lib/db/schema';

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Check if product table exists
    try {
      const productCount = await db.select().from(product).limit(1);
      console.log('✅ Product table exists and is accessible');
    } catch (error) {
      console.log('❌ Product table does not exist or is not accessible:', (error as Error).message);
    }
    
    // Check if user table has role column
    try {
      const userCount = await db.select().from(user).limit(1);
      console.log('✅ User table exists and is accessible');
    } catch (error) {
      console.log('❌ User table issue:', (error as Error).message);
    }
    
    console.log('🎉 Database check completed');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();
