import { db } from '../lib/db';
import { user, account } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

async function createAdminProper() {
  try {
    console.log('🔐 Creating admin account properly...');
    
    // First, delete any existing admin user and account
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@timco.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('🗑️  Removing existing admin user...');
      
      // Delete account first (foreign key constraint)
      await db
        .delete(account)
        .where(eq(account.userId, existingAdmin[0].id));
      
      // Delete user
      await db
        .delete(user)
        .where(eq(user.id, existingAdmin[0].id));
    }

    // Create new admin user
    console.log('👤 Creating new admin user...');
    const newAdmin = await db
      .insert(user)
      .values({
        name: 'Admin User',
        email: 'admin@timco.com',
        role: 'super_admin',
        emailVerified: true,
      })
      .returning();

    console.log('✅ Admin user created:', newAdmin[0].id);

    // Create account with proper password hash
    console.log('🔑 Creating account with password...');
    const password = 'admin123';
    const hashedPassword = await hash(password);

    await db.insert(account).values({
      accountId: newAdmin[0].id,
      providerId: 'credential',
      userId: newAdmin[0].id,
      password: hashedPassword,
    });

    console.log('✅ Admin account setup complete!');
    console.log('📧 Email: admin@timco.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: super_admin');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/login');
    console.log('🎯 Then access admin panel at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  }
}

createAdminProper();
