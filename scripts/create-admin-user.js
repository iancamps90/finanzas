#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...');
    
    // Verificar si ya existe un usuario admin
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@finanzas.com' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@finanzas.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
        locale: 'es',
        currency: 'EUR',
        emailVerified: new Date(),
      }
    });
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@finanzas.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
