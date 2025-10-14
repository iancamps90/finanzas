# 🚀 Script de Configuración para Producción - Windows PowerShell
# Finance Dash Pro - Setup para Vercel

Write-Host "🚀 Configurando Finance Dash Pro para Producción..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Función para mostrar pasos
function Show-Step {
    param([string]$Message)
    Write-Host "📋 $Message" -ForegroundColor Cyan
}

function Show-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Show-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Show-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Paso 1: Verificar dependencias
Show-Step "Verificando dependencias..."

try {
    $nodeVersion = node --version
    Show-Success "Node.js encontrado: $nodeVersion"
} catch {
    Show-Error "Node.js no está instalado"
    exit 1
}

try {
    $npmVersion = npm --version
    Show-Success "npm encontrado: $npmVersion"
} catch {
    Show-Error "npm no está instalado"
    exit 1
}

# Verificar Vercel CLI
try {
    $vercelVersion = vercel --version
    Show-Success "Vercel CLI encontrado: $vercelVersion"
} catch {
    Show-Warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
    Show-Success "Vercel CLI instalado"
}

# Paso 2: Generar secretos
Show-Step "Generando secretos de seguridad..."

# Generar NEXTAUTH_SECRET aleatorio
$nextauthSecret = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
Write-Host "NEXTAUTH_SECRET generado: $($nextauthSecret.Substring(0, 20))..." -ForegroundColor Green

# Paso 3: Crear archivo de configuración
Show-Step "Creando archivo de configuración..."

$envContent = @"
# Variables de entorno para producción
# NO COMMITEAR ESTE ARCHIVO

# Database
DATABASE_URL="postgresql://username:password@host:5432/finance_dash_pro"

# NextAuth
NEXTAUTH_SECRET="$nextauthSecret"
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
"@

$envContent | Out-File -FilePath ".env.production.local" -Encoding UTF8
Show-Success "Archivo de configuración creado"

# Paso 4: Instalar dependencias
Show-Step "Instalando dependencias..."
npm install
if ($LASTEXITCODE -eq 0) {
    Show-Success "Dependencias instaladas"
} else {
    Show-Error "Error instalando dependencias"
    exit 1
}

# Paso 5: Generar cliente Prisma
Show-Step "Generando cliente Prisma..."
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Show-Success "Cliente Prisma generado"
} else {
    Show-Error "Error generando cliente Prisma"
    exit 1
}

# Paso 6: Verificar build
Show-Step "Verificando build de producción..."
npm run build
if ($LASTEXITCODE -eq 0) {
    Show-Success "Build exitoso"
} else {
    Show-Error "Error en el build"
    exit 1
}

# Paso 7: Mostrar próximos pasos
Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🌐 Configurar base de datos PostgreSQL:" -ForegroundColor White
Write-Host "   - Vercel Postgres (recomendado)" -ForegroundColor Gray
Write-Host "   - Supabase (gratis)" -ForegroundColor Gray
Write-Host "   - Railway o Neon" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔑 Configurar variables de entorno en Vercel:" -ForegroundColor White
Write-Host "   - Ve a tu proyecto en Vercel" -ForegroundColor Gray
Write-Host "   - Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   - Agrega todas las variables del archivo .env.production.local" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🚀 Desplegar:" -ForegroundColor White
Write-Host "   - vercel --prod" -ForegroundColor Gray
Write-Host "   - O conecta tu repositorio GitHub con Vercel" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🌍 Configurar dominio:" -ForegroundColor White
Write-Host "   - Agrega finanzas.iancamps.dev en Vercel" -ForegroundColor Gray
Write-Host "   - Configura DNS en tu proveedor" -ForegroundColor Gray
Write-Host ""
Write-Host "5. 📊 Probar Power BI:" -ForegroundColor White
Write-Host "   - https://finanzas.iancamps.dev/api/bi/transactions.csv" -ForegroundColor Gray
Write-Host "   - https://finanzas.iancamps.dev/api/bi/public" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 URLs importantes:" -ForegroundColor Yellow
Write-Host "   - Dashboard: https://finanzas.iancamps.dev/dashboard" -ForegroundColor Cyan
Write-Host "   - Power BI: https://finanzas.iancamps.dev/powerbi" -ForegroundColor Cyan
Write-Host "   - API Demo: https://finanzas.iancamps.dev/api/bi/public" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentación:" -ForegroundColor Yellow
Write-Host "   - deploy.md - Guía completa de despliegue" -ForegroundColor Gray
Write-Host "   - docs/powerbi/POWER_BI_INTEGRATION.md - Integración Power BI" -ForegroundColor Gray
Write-Host ""
Show-Success "¡Todo listo para producción!"
