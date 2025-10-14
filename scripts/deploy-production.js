#!/usr/bin/env node

/**
 * 🚀 Script de Despliegue a Producción
 * Finance Dash Pro - Migración automática a PostgreSQL
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando despliegue a producción...');
  console.log('=====================================');

  try {
    // Paso 1: Verificar conexión a la base de datos
    console.log('📊 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');

    // Paso 2: Ejecutar migraciones
    console.log('🔄 Ejecutando migraciones...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Migraciones completadas');
    } catch (error) {
      console.log('⚠️ Error en migraciones, intentando con reset...');
      execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
      console.log('✅ Base de datos reseteada y migrada');
    }

    // Paso 3: Generar cliente Prisma
    console.log('🔧 Generando cliente Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado');

    // Paso 4: Verificar si necesitamos seed
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios en la base de datos: ${userCount}`);

    if (userCount === 0 && process.env.DEMO_SEED === 'true') {
      console.log('🌱 Ejecutando seed con datos demo...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Seed completado');
    }

    // Paso 5: Verificar tablas principales
    console.log('📋 Verificando estructura de la base de datos...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`✅ Tablas creadas: ${tables.length}`);
    console.log('📊 Tablas:', tables.map(t => t.table_name).join(', '));

    // Paso 6: Estadísticas básicas
    const stats = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      transactions: await prisma.transaction.count(),
      companies: await prisma.company.count(),
    };

    console.log('\n📈 Estadísticas de la base de datos:');
    console.log(`👥 Usuarios: ${stats.users}`);
    console.log(`📁 Categorías: ${stats.categories}`);
    console.log(`💰 Transacciones: ${stats.transactions}`);
    console.log(`🏢 Empresas: ${stats.companies}`);

    console.log('\n🎉 ¡Despliegue completado exitosamente!');
    console.log('=====================================');
    console.log('🔗 URLs importantes:');
    console.log('📊 Dashboard: https://finanzas.iancamps.dev/dashboard');
    console.log('🔐 Login: https://finanzas.iancamps.dev/login');
    console.log('📈 Power BI: https://finanzas.iancamps.dev/powerbi');
    console.log('📊 API Demo: https://finanzas.iancamps.dev/api/bi/public');
    
    if (stats.users > 0) {
      console.log('\n👤 Usuarios de prueba:');
      console.log('📧 demo@example.com / demo123');
      console.log('📧 admin@example.com / admin123');
    }

  } catch (error) {
    console.error('❌ Error durante el despliegue:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

module.exports = main;
