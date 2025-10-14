# 🚀 Guía de Despliegue a Producción

## Paso 1: Configurar Base de Datos PostgreSQL

### Opción A: Vercel Postgres (Recomendado)
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a "Storage" → "Create Database" → "Postgres"
4. Copia la `DATABASE_URL` generada

### Opción B: Supabase (Gratis)
1. Crea cuenta en [Supabase](https://supabase.com)
2. Crea nuevo proyecto
3. Ve a Settings → Database
4. Copia la connection string

### Opción C: Railway/Neon
1. [Railway](https://railway.app) - $5/mes
2. [Neon](https://neon.tech) - Plan gratuito disponible

## Paso 2: Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=tu-secret-super-seguro
NEXTAUTH_URL=https://finanzas.iancamps.dev
NEXT_PUBLIC_APP_URL=https://finanzas.iancamps.dev
BI_PUBLIC=true
NODE_ENV=production
```

## Paso 3: Desplegar en Vercel

### Desde GitHub (Recomendado):
1. Sube tu código a GitHub
2. Conecta Vercel con tu repositorio
3. Vercel detectará automáticamente que es Next.js
4. Configura las variables de entorno
5. ¡Deploy automático!

### Desde CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Paso 4: Configurar Dominio Personalizado

1. En Vercel → Settings → Domains
2. Agrega `finanzas.iancamps.dev`
3. Configura los DNS en tu proveedor:
   ```
   CNAME finanzas 76.76.19.61
   ```
4. Espera la propagación (5-10 minutos)

## Paso 5: Migrar Base de Datos

```bash
# Instalar Prisma CLI globalmente
npm install -g prisma

# Generar cliente
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Opcional: Seed con datos demo
npx prisma db seed
```

## Paso 6: Configurar Power BI

1. Tu aplicación ya tiene endpoints listos:
   - `https://finanzas.iancamps.dev/api/bi/transactions.csv`
   - `https://finanzas.iancamps.dev/api/bi/transactions.json`

2. En Power BI Desktop:
   - Obtener datos → Web
   - Pega la URL del CSV
   - ¡Listo para crear dashboards!

## Características de Producción Habilitadas

✅ **Autenticación segura** con NextAuth
✅ **Base de datos PostgreSQL** para escalabilidad
✅ **Power BI Integration** completa
✅ **ERP Multi-tenant** para empresas
✅ **Internacionalización** (ES/EN)
✅ **Rate limiting** para seguridad
✅ **CORS configurado** correctamente
✅ **Headers de seguridad** implementados

## Monitoreo y Analytics

### Opcional: Google Analytics
1. Crea cuenta en Google Analytics
2. Agrega `GA_TRACKING_ID` a variables de entorno

### Opcional: Sentry (Monitoreo de errores)
1. Crea cuenta en Sentry
2. Agrega `SENTRY_DSN` a variables de entorno

## Costos Estimados

- **Vercel**: Gratis (plan hobby) - $20/mes (pro)
- **Base de datos**: Gratis (Supabase) - $5/mes (Railway)
- **Dominio**: $10-15/año
- **Total**: ~$0-25/mes

## Próximos Pasos

1. **Despliegue inicial** ✅
2. **Configurar analytics** 📊
3. **Implementar backup automático** 💾
4. **Optimizar rendimiento** ⚡
5. **Añadir más integraciones** 🔌

¡Tu aplicación estará lista para producción!
