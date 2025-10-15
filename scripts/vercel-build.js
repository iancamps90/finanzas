#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para Vercel...');

try {
  // 1. Generar cliente Prisma
  console.log('📦 Generando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 2. Ejecutar migraciones si hay DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Ejecutando migraciones de base de datos...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migraciones ejecutadas correctamente');
    } catch (error) {
      console.log('⚠️ Error en migraciones, continuando con build...');
      console.log('Esto es normal si la base de datos no está configurada aún');
    }
  } else {
    console.log('⚠️ No hay DATABASE_URL configurada, saltando migraciones');
  }

  // 3. Ejecutar build de Next.js
  console.log('🔨 Ejecutando build de Next.js...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completado exitosamente');
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}
