# 🚀 Finance Dash Pro

**Sistema profesional de gestión financiera con integración completa de Power BI**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iancamps90/finanzas)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-finanzas.iancamps.dev-blue)](https://finanzas.iancamps.dev)

## ✨ Características

### 🏠 **Gestión Financiera Personal**
- ✅ Dashboard completo con KPIs
- ✅ Gestión de transacciones
- ✅ Categorización inteligente
- ✅ Presupuestos y objetivos
- ✅ Reportes detallados

### 🏢 **ERP Empresarial Multi-tenant**
- ✅ Gestión de empresas
- ✅ Facturación completa
- ✅ Contabilidad PGC España
- ✅ Reportes fiscales (IVA, IRPF)
- ✅ Asientos contables automáticos

### 📊 **Integración Power BI**
- ✅ Conexión directa con Power BI Desktop
- ✅ APIs optimizadas para Business Intelligence
- ✅ Datos en tiempo real
- ✅ Templates y medidas DAX incluidas
- ✅ Endpoints públicos para demo

### 🔐 **Seguridad y Autenticación**
- ✅ NextAuth.js con múltiples proveedores
- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Headers de seguridad
- ✅ Validación de datos con Zod

## 🚀 Despliegue Rápido

### **Opción 1: Vercel (Recomendado)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iancamps90/finanzas)

1. Click en el botón de arriba
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno
4. ¡Deploy automático!

### **Opción 2: Despliegue Manual**

```bash
# Clonar repositorio
git clone https://github.com/iancamps90/finanzas.git
cd finanzas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local

# Configurar base de datos PostgreSQL
npm run db:push

# Ejecutar seed (opcional)
npm run db:seed

# Desarrollar
npm run dev

# Desplegar a producción
npm run deploy:production
```

## 📊 Power BI Integration

### **Conexión Directa**
```
URL: https://finanzas.iancamps.dev/api/bi/transactions.csv
```

### **Datos Demo Públicos**
```
URL: https://finanzas.iancamps.dev/api/bi/public
```

### **Documentación Completa**
- 📚 [Guía de Integración Power BI](docs/powerbi/POWER_BI_INTEGRATION.md)
- 📊 [Medidas DAX Pre-configuradas](docs/powerbi/README_POWER_BI.md)
- 📈 [Templates y Ejemplos](docs/powerbi/)

## 🛠️ Stack Tecnológico

### **Frontend**
- ⚡ **Next.js 14** - React framework
- 🎨 **Tailwind CSS** - Styling
- 🧩 **Radix UI** - Componentes accesibles
- 🌐 **Next-intl** - Internacionalización
- 📱 **Responsive Design** - Mobile-first

### **Backend**
- 🗄️ **PostgreSQL** - Base de datos
- 🔧 **Prisma** - ORM y migraciones
- 🔐 **NextAuth.js** - Autenticación
- 📊 **APIs REST** - Endpoints optimizados
- ⚡ **Server Components** - Rendering híbrido

### **DevOps**
- 🚀 **Vercel** - Hosting y CDN
- 🔄 **GitHub Actions** - CI/CD
- 📊 **PostgreSQL** - Base de datos en la nube
- 🌍 **Dominio personalizado** - finanzas.iancamps.dev

## 📋 Variables de Entorno

### **Requeridas**
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=tu-secret-seguro
NEXTAUTH_URL=https://tu-dominio.com
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### **Opcionales**
```bash
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
BI_PUBLIC=true
DEMO_SEED=true
```

## 🎯 URLs de Producción

- 🏠 **Dashboard**: https://finanzas.iancamps.dev/dashboard
- 📊 **Power BI**: https://finanzas.iancamps.dev/powerbi
- 🔐 **Login**: https://finanzas.iancamps.dev/login
- 📈 **API Demo**: https://finanzas.iancamps.dev/api/bi/public
- 🏢 **Registro**: https://finanzas.iancamps.dev/register

## 👥 Usuarios Demo

```
📧 demo@example.com / demo123
👑 admin@example.com / admin123
```

## 📚 Documentación

- 📖 [Guía de Despliegue](deploy.md)
- 🌍 [Configuración de Dominio](docs/DOMAIN_SETUP.md)
- 📊 [Integración Power BI](docs/powerbi/POWER_BI_INTEGRATION.md)
- 🗄️ [Migración PostgreSQL](scripts/migrate-to-postgres.sql)

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción
npm run db:push          # Migrar base de datos
npm run db:seed          # Poblar con datos demo
npm run deploy:production # Deploy completo
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - El framework React
- [Prisma](https://prisma.io/) - El ORM de próxima generación
- [Vercel](https://vercel.com/) - La plataforma de hosting
- [Power BI](https://powerbi.microsoft.com/) - Business Intelligence
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

⭐ **¡Dale una estrella al repositorio si te gusta el proyecto!**