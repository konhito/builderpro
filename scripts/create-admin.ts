import { db } from '../lib/db';
import { user } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function createAdminAccount() {
  try {
    console.log('🔐 Creating admin account...');
    
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@timco.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin account already exists!');
      console.log('📧 Email: admin@timco.com');
      console.log('👤 Role:', existingAdmin[0].role);
      console.log('🆔 ID:', existingAdmin[0].id);
      return;
    }

    // Create admin user
    const adminUser = await db
      .insert(user)
      .values({
        name: 'Admin User',
        email: 'admin@timco.com',
        role: 'super_admin',
        emailVerified: true,
      })
      .returning();

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@timco.com');
    console.log('👤 Name: Admin User');
    console.log('🔑 Role: super_admin');
    console.log('🆔 ID:', adminUser[0].id);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Go to /register page');
    console.log('2. Use email: admin@timco.com');
    console.log('3. Set your password');
    console.log('4. Login and access /admin');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  }
}

createAdminAccount();
