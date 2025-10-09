import { db } from '../lib/db';
import { user, account } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

async function setupAdminAuth() {
  try {
    console.log('🔐 Setting up admin authentication...');
    
    // Check if admin user exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@timco.com'))
      .limit(1);

    if (existingAdmin.length === 0) {
      console.log('❌ Admin user not found. Please run create-admin.ts first.');
      return;
    }

    const adminUser = existingAdmin[0];
    console.log('✅ Found admin user:', adminUser.email);

    // Check if account exists
    const existingAccount = await db
      .select()
      .from(account)
      .where(eq(account.userId, adminUser.id))
      .limit(1);

    if (existingAccount.length > 0) {
      console.log('⚠️  Admin account already exists!');
      console.log('📧 Email: admin@timco.com');
      console.log('🔑 You can now login with this email and any password');
      console.log('🚀 Go to: http://localhost:3000/login');
      return;
    }

    // Create password hash
    const password = 'admin123'; // Default password
    const hashedPassword = await hash(password);

    // Create account record for email/password authentication
    await db.insert(account).values({
      accountId: adminUser.id,
      providerId: 'credential',
      userId: adminUser.id,
      password: hashedPassword,
    });

    console.log('✅ Admin authentication setup complete!');
    console.log('📧 Email: admin@timco.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/login');
    console.log('🎯 Then access admin panel at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error setting up admin auth:', error);
  }
}

setupAdminAuth();
