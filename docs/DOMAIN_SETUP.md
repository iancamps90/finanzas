# 🌍 Configuración de Dominio - finanzas.iancamps.dev

## 📋 Guía Paso a Paso

### **Paso 1: Configurar DNS en tu Proveedor**

Dependiendo de tu proveedor de dominio, configura los siguientes registros:

#### **Opción A: Registro CNAME (Recomendado)**
```
Tipo: CNAME
Nombre: finanzas
Valor: cname.vercel-dns.com
TTL: 300 (5 minutos)
```

#### **Opción B: Registro A (Alternativo)**
```
Tipo: A
Nombre: finanzas
Valor: 76.76.19.61
TTL: 300 (5 minutos)
```

### **Paso 2: Configurar en Vercel**

1. **Ve a tu proyecto en Vercel**
2. **Settings** → **Domains**
3. **Add Domain** → `finanzas.iancamps.dev`
4. **Click "Add"**

### **Paso 3: Verificar Configuración**

Vercel te mostrará las instrucciones específicas para tu dominio. Normalmente será algo como:

```
CNAME finanzas cname.vercel-dns.com
```

### **Paso 4: Esperar Propagación**

- ⏱️ **Tiempo de propagación**: 5-15 minutos
- 🔍 **Verificar**: Usa `nslookup finanzas.iancamps.dev`
- ✅ **Estado**: Aparecerá como "Valid Configuration" en Vercel

## 🔧 Configuraciones por Proveedor

### **Cloudflare**
1. Ve a **DNS** → **Records**
2. Agrega registro:
   ```
   Type: CNAME
   Name: finanzas
   Target: cname.vercel-dns.com
   TTL: Auto
   ```

### **GoDaddy**
1. Ve a **My Products** → **DNS**
2. Agrega registro:
   ```
   Type: CNAME
   Host: finanzas
   Points to: cname.vercel-dns.com
   TTL: 600 seconds
   ```

### **Namecheap**
1. Ve a **Domain List** → **Manage** → **Advanced DNS**
2. Agrega registro:
   ```
   Type: CNAME Record
   Host: finanzas
   Value: cname.vercel-dns.com
   TTL: 5 min
   ```

### **Google Domains**
1. Ve a **DNS** → **Custom records**
2. Agrega registro:
   ```
   Resource record type: CNAME
   Name: finanzas
   Data: cname.vercel-dns.com
   TTL: 3600
   ```

## 🚀 Configuración SSL Automática

Vercel configurará automáticamente:
- ✅ **SSL Certificate** (Let's Encrypt)
- ✅ **HTTPS Redirect**
- ✅ **HTTP/2 Support**
- ✅ **CDN Global**

## 🔍 Verificación y Testing

### **Comandos de Verificación**

```bash
# Verificar DNS
nslookup finanzas.iancamps.dev

# Verificar SSL
curl -I https://finanzas.iancamps.dev

# Verificar respuesta
curl https://finanzas.iancamps.dev/api/health
```

### **URLs de Prueba**

Una vez configurado, estas URLs deberían funcionar:

- 🏠 **Dashboard**: https://finanzas.iancamps.dev/dashboard
- 📊 **Power BI**: https://finanzas.iancamps.dev/powerbi
- 🔐 **Login**: https://finanzas.iancamps.dev/login
- 📈 **API Demo**: https://finanzas.iancamps.dev/api/bi/public
- 🏢 **Registro**: https://finanzas.iancamps.dev/register

## 🛠️ Solución de Problemas

### **DNS No Resuelve**
- ✅ Verifica que el registro CNAME esté correcto
- ✅ Espera 15-30 minutos para propagación
- ✅ Usa `dig finanzas.iancamps.dev` para debug

### **SSL No Funciona**
- ✅ Vercel configura SSL automáticamente
- ✅ Espera 5-10 minutos después de verificar DNS
- ✅ Verifica en Vercel Dashboard → Domains

### **Error 404**
- ✅ Verifica que el proyecto esté desplegado
- ✅ Comprueba que el dominio esté configurado
- ✅ Revisa logs en Vercel Dashboard

### **Error de CORS**
- ✅ Ya está configurado en `vercel.json`
- ✅ Verifica variables de entorno `CORS_ORIGIN`

## 📊 Monitoreo del Dominio

### **Herramientas Recomendadas**

1. **Uptime Robot** (Gratis)
   - Monitoreo cada 5 minutos
   - Alertas por email/SMS

2. **Pingdom** (Freemium)
   - Monitoreo avanzado
   - Reportes detallados

3. **StatusCake** (Gratis)
   - Monitoreo básico
   - Alertas por email

### **Configuración Básica**

```
URL: https://finanzas.iancamps.dev
Interval: 5 minutes
Timeout: 30 seconds
Regions: Multiple (US, EU, Asia)
```

## 🔐 Configuraciones de Seguridad

### **Headers de Seguridad**

Ya configurados en `next.config.js`:

```javascript
headers: [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ],
  },
]
```

### **CSP (Content Security Policy)**

Agregar en `next.config.js` si es necesario:

```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
}
```

## 📈 Analytics y SEO

### **Google Analytics**

1. Crear propiedad en Google Analytics
2. Agregar `GA_TRACKING_ID` a variables de entorno
3. Configurar en `src/lib/config.ts`

### **SEO Básico**

```javascript
// src/app/layout.tsx
export const metadata = {
  title: 'Finance Dash Pro - Gestión Financiera',
  description: 'Sistema profesional de gestión financiera con Power BI',
  keywords: 'finanzas, presupuesto, Power BI, contabilidad',
  openGraph: {
    title: 'Finance Dash Pro',
    description: 'Sistema profesional de gestión financiera',
    url: 'https://finanzas.iancamps.dev',
    siteName: 'Finance Dash Pro',
    locale: 'es_ES',
    type: 'website',
  },
}
```

## 🎯 Próximos Pasos

1. ✅ **Configurar DNS**
2. ✅ **Verificar en Vercel**
3. ✅ **Probar todas las URLs**
4. ✅ **Configurar monitoreo**
5. ✅ **Optimizar SEO**
6. ✅ **Configurar analytics**

---

¡Con esta configuración tendrás tu dominio `finanzas.iancamps.dev` funcionando perfectamente! 🚀
