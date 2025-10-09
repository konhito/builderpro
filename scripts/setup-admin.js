const { db } = require('../lib/db');
const { user } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'admin@timco.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists!');
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

    console.log('Admin user created successfully!');
    console.log('Email: admin@timco.com');
    console.log('Role: super_admin');
    console.log('Please set a password through the registration process.');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin();
