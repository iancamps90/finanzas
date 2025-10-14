# Guía de Integración con Excel

Esta guía te ayudará a importar y analizar tus datos financieros de Finance Dash Pro en Microsoft Excel.

## 📋 Requisitos Previos

- Microsoft Excel 2016 o superior
- Acceso a Finance Dash Pro
- Datos de transacciones en tu cuenta

## 📥 Importación de Datos

### Método 1: Descarga Directa

1. Inicia sesión en Finance Dash Pro
2. Ve a **Transacciones** > **Exportar** > **CSV**
3. Descarga el archivo CSV
4. Abre Excel y ve a **Datos** > **Obtener datos** > **Desde archivo** > **Desde texto/CSV**
5. Selecciona el archivo descargado
6. Configura:
   - **Codificación**: UTF-8
   - **Delimitador**: Coma
   - **Primera fila como encabezados**: Sí
7. Haz clic en **Cargar**

### Método 2: Power Query (Recomendado)

1. En Excel, ve a **Datos** > **Obtener datos** > **Desde otras fuentes** > **Consulta en blanco**
2. En el Editor de Power Query, ve a **Inicio** > **Nueva fuente** > **Otros** > **Web**
3. Ingresa la URL del endpoint de Power BI (disponible en la sección Power BI)
4. Configura la conexión como CSV
5. Aplica transformaciones si es necesario
6. Haz clic en **Cerrar y cargar**

## 📊 Estructura de Datos

El archivo CSV incluye las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `fecha` | Fecha de la transacción | 2024-01-15 |
| `tipo` | Tipo de transacción | Ingreso/Gasto |
| `categoria` | Categoría | Supermercado |
| `monto` | Monto | 85.50 |
| `descripcion` | Descripción | Compra semanal |
| `metodo_pago` | Método de pago | Tarjeta |
| `etiquetas` | Etiquetas | necesario, planificado |

## 🎯 Creación de Tablas Dinámicas

### Tabla 1: Resumen Mensual

1. Selecciona todos los datos
2. Ve a **Insertar** > **Tabla dinámica**
3. Configura:
   - **Filas**: `fecha` (agrupa por mes)
   - **Columnas**: `tipo`
   - **Valores**: Suma de `monto`
4. Aplica formato de moneda a los valores

### Tabla 2: Análisis por Categoría

1. Crea nueva tabla dinámica
2. Configura:
   - **Filas**: `categoria`
   - **Columnas**: `tipo`
   - **Valores**: Suma de `monto`
3. Ordena por monto descendente
4. Aplica filtros para mostrar solo las categorías más relevantes

### Tabla 3: Métodos de Pago

1. Crea nueva tabla dinámica
2. Configura:
   - **Filas**: `metodo_pago`
   - **Valores**: Suma de `monto`, Recuento de transacciones
3. Calcula el promedio por transacción

## 📈 Gráficos Recomendados

### 1. Evolución Temporal

**Gráfico de líneas combinado:**
- Eje X: Mes
- Eje Y: Monto
- Series: Ingresos y Gastos
- Línea de tendencia para cada serie

### 2. Distribución de Gastos

**Gráfico circular:**
- Datos: Categorías de gastos
- Valores: Suma de montos
- Muestra porcentajes y valores absolutos

### 3. Comparación Mensual

**Gráfico de barras apiladas:**
- Eje X: Mes
- Eje Y: Monto
- Series: Categorías principales
- Colores diferenciados por categoría

### 4. Análisis de Métodos de Pago

**Gráfico de barras horizontales:**
- Eje Y: Método de pago
- Eje X: Monto total
- Ordenado de mayor a menor

## 🧮 Fórmulas Útiles

### Cálculos Básicos

```excel
=SUMIFS(monto,tipo,"Ingreso")          // Total ingresos
=SUMIFS(monto,tipo,"Gasto")            // Total gastos
=SUMIFS(monto,tipo,"Ingreso")-SUMIFS(monto,tipo,"Gasto")  // Balance
```

### Análisis por Categoría

```excel
=SUMIFS(monto,categoria,"Supermercado")  // Gastos en supermercado
=COUNTIFS(categoria,"Supermercado")      // Número de compras
=AVERAGEIFS(monto,categoria,"Supermercado")  // Promedio por compra
```

### Análisis Temporal

```excel
=SUMIFS(monto,MONTH(fecha),1)           // Gastos de enero
=SUMIFS(monto,YEAR(fecha),2024)         // Gastos del año 2024
=SUMIFS(monto,fecha,">="&DATE(2024,1,1),fecha,"<="&DATE(2024,12,31))  // Rango de fechas
```

### Cálculos Avanzados

```excel
=PERCENTILE(monto,0.9)                  // Percentil 90 de gastos
=STDEV(monto)                           // Desviación estándar
=CORREL(monto,ROW(monto))               // Correlación con tendencia
```

## 🔄 Automatización con Power Query

### Actualización Automática

1. Configura la conexión web en Power Query
2. Establece la actualización automática:
   - **Datos** > **Propiedades de conexión**
   - Marca "Actualizar al abrir el archivo"
   - Configura la frecuencia de actualización

### Transformaciones Automáticas

1. **Agregar columnas calculadas:**
   - Mes: `=MONTH([fecha])`
   - Año: `=YEAR([fecha])`
   - Trimestre: `=ROUNDUP(MONTH([fecha])/3,0)`

2. **Filtrar datos:**
   - Solo transacciones del año actual
   - Excluir categorías específicas
   - Filtrar por rango de montos

3. **Agrupar datos:**
   - Por mes y categoría
   - Por método de pago
   - Por rango de montos

## 📊 Dashboard Interactivo

### Creación de un Dashboard

1. **Hoja 1: Datos** - Datos originales importados
2. **Hoja 2: Resumen** - Tablas dinámicas principales
3. **Hoja 3: Gráficos** - Visualizaciones
4. **Hoja 4: Dashboard** - Vista consolidada

### Elementos del Dashboard

- **KPI Cards**: Total ingresos, gastos, balance
- **Gráfico de líneas**: Evolución mensual
- **Gráfico circular**: Distribución por categoría
- **Tabla**: Top 10 categorías
- **Filtros**: Por fecha, categoría, método de pago

### Interactividad

1. Usa **Segmentadores** para filtros interactivos
2. Conecta múltiples tablas dinámicas
3. Aplica **Formato condicional** para destacar valores importantes
4. Usa **Validación de datos** para controles de entrada

## 🎨 Formato y Presentación

### Formato de Números

```excel
#,##0.00 €              // Formato de moneda
#,##0                   // Formato de número
0.00%                   // Formato de porcentaje
```

### Formato Condicional

1. **Escalas de color** para montos
2. **Iconos** para indicar tendencias
3. **Barras de datos** para comparaciones visuales

### Estilos de Tabla

1. Aplica **Estilos de tabla** predefinidos
2. Usa **Temas** consistentes
3. Mantén **Colores** coherentes con la marca

## 🔧 Solución de Problemas

### Problemas de Importación

- **Error de codificación**: Cambia a UTF-8
- **Delimitador incorrecto**: Verifica que sea coma
- **Fechas mal formateadas**: Usa la función FECHA()

### Problemas de Cálculos

- **Valores como texto**: Usa VALOR() para convertir
- **Fechas como números**: Usa FECHA() para formatear
- **Errores de referencia**: Verifica los rangos de datos

### Problemas de Rendimiento

- **Archivo muy grande**: Usa filtros para reducir datos
- **Cálculos lentos**: Optimiza las fórmulas
- **Actualizaciones lentas**: Reduce la frecuencia de actualización

## 📱 Compartir y Colaborar

### Compartir el Archivo

1. **OneDrive/SharePoint**: Para colaboración en tiempo real
2. **Email**: Como adjunto (considera el tamaño)
3. **PDF**: Para presentaciones estáticas

### Protección

1. **Proteger hojas**: Evita modificaciones accidentales
2. **Proteger celdas**: Solo permite edición en campos específicos
3. **Contraseñas**: Para archivos sensibles

---

**Consejo**: Mantén una copia de seguridad de tus datos originales y documenta las fórmulas y transformaciones que uses para facilitar futuras actualizaciones.

