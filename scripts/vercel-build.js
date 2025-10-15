#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para Vercel...');

try {
  // 1. Generar cliente Prisma
  console.log('📦 Generando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 2. Ejecutar setup de producción
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Ejecutando setup de producción...');
    try {
      execSync('node scripts/setup-production.js', { stdio: 'inherit' });
      console.log('✅ Setup de producción completado');
    } catch (error) {
      console.log('⚠️ Error en setup, continuando con build...');
      console.log('Esto es normal si la base de datos no está configurada aún');
    }
  } else {
    console.log('⚠️ No hay DATABASE_URL configurada, saltando setup');
  }

  // 3. Ejecutar build de Next.js
  console.log('🔨 Ejecutando build de Next.js...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completado exitosamente');
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}
