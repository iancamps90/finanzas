#!/bin/bash

# 🚀 Script de Configuración para Producción
# Finance Dash Pro - Setup para Vercel

echo "🚀 Configurando Finance Dash Pro para Producción..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar pasos
show_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Paso 1: Verificar dependencias
show_step "Verificando dependencias..."

if ! command -v node &> /dev/null; then
    show_error "Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    show_error "npm no está instalado"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    show_warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

show_success "Dependencias verificadas"

# Paso 2: Generar secretos
show_step "Generando secretos de seguridad..."

NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET generado: ${NEXTAUTH_SECRET:0:20}..."

# Paso 3: Crear archivo de configuración
show_step "Creando archivo de configuración..."

cat > .env.production.local << EOF
# Variables de entorno para producción
# NO COMMITEAR ESTE ARCHIVO

# Database
DATABASE_URL="postgresql://username:password@host:5432/finance_dash_pro"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://finanzas.iancamps.dev"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://finanzas.iancamps.dev"

# Power BI Integration
BI_PUBLIC="true"
ENABLE_POWER_BI="true"

# Features
ENABLE_REGISTRATION="true"
ENABLE_GOOGLE_AUTH="false"
ENABLE_EXPORT="true"
ENABLE_ANALYTICS="true"

# Demo Data
DEMO_SEED="false"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# File Upload
MAX_FILE_SIZE="10485760"
EOF

show_success "Archivo de configuración creado"

# Paso 4: Instalar dependencias
show_step "Instalando dependencias..."
npm install
show_success "Dependencias instaladas"

# Paso 5: Generar cliente Prisma
show_step "Generando cliente Prisma..."
npx prisma generate
show_success "Cliente Prisma generado"

# Paso 6: Verificar build
show_step "Verificando build de producción..."
npm run build

if [ $? -eq 0 ]; then
    show_success "Build exitoso"
else
    show_error "Error en el build"
    exit 1
fi

# Paso 7: Mostrar próximos pasos
echo ""
echo "🎉 ¡Configuración completada!"
echo "================================"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. 🌐 Configurar base de datos PostgreSQL:"
echo "   - Vercel Postgres (recomendado)"
echo "   - Supabase (gratis)"
echo "   - Railway o Neon"
echo ""
echo "2. 🔑 Configurar variables de entorno en Vercel:"
echo "   - Ve a tu proyecto en Vercel"
echo "   - Settings → Environment Variables"
echo "   - Agrega todas las variables del archivo .env.production.local"
echo ""
echo "3. 🚀 Desplegar:"
echo "   - vercel --prod"
echo "   - O conecta tu repositorio GitHub con Vercel"
echo ""
echo "4. 🌍 Configurar dominio:"
echo "   - Agrega finanzas.iancamps.dev en Vercel"
echo "   - Configura DNS en tu proveedor"
echo ""
echo "5. 📊 Probar Power BI:"
echo "   - https://finanzas.iancamps.dev/api/bi/transactions.csv"
echo "   - https://finanzas.iancamps.dev/api/bi/public"
echo ""
echo "🔗 URLs importantes:"
echo "   - Dashboard: https://finanzas.iancamps.dev/dashboard"
echo "   - Power BI: https://finanzas.iancamps.dev/powerbi"
echo "   - API Demo: https://finanzas.iancamps.dev/api/bi/public"
echo ""
echo "📚 Documentación:"
echo "   - deploy.md - Guía completa de despliegue"
echo "   - docs/powerbi/POWER_BI_INTEGRATION.md - Integración Power BI"
echo ""
show_success "¡Todo listo para producción!"
