#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up production environment...');

try {
  // 1. Ejecutar migraciones
  console.log('📦 Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // 2. Generar cliente Prisma
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Ejecutar seed si está habilitado
  if (process.env.DEMO_SEED === 'true') {
    console.log('🌱 Seeding database with demo data...');
    try {
      execSync('npm run db:seed', { stdio: 'inherit' });
      console.log('✅ Demo data seeded successfully');
    } catch (error) {
      console.log('⚠️ Seed failed, continuing without demo data...');
    }
  }

  console.log('✅ Production setup completed');
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
}
