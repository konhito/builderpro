import { db } from '../lib/db';
import { user, account } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

async function registerAdmin() {
  try {
    console.log('🔐 Registering admin user...');
    
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@timco.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@timco.com');
      console.log('🔑 You can login with this email and password: admin123');
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

    console.log('✅ Admin user created:', adminUser[0].id);

    // Create account with password
    const password = 'admin123';
    const hashedPassword = await hash(password);

    await db.insert(account).values({
      accountId: adminUser[0].id,
      providerId: 'credential',
      userId: adminUser[0].id,
      password: hashedPassword,
    });

    console.log('✅ Admin account registered successfully!');
    console.log('📧 Email: admin@timco.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: super_admin');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/login');
    console.log('🎯 Then access admin panel at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error registering admin:', error);
  }
}

registerAdmin();
