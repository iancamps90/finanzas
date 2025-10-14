# Guía de Integración con Power BI

Esta guía te ayudará a conectar Finance Dash Pro con Microsoft Power BI para crear análisis avanzados de tus datos financieros.

## 📋 Requisitos Previos

- Microsoft Power BI Desktop (gratuito)
- Acceso a Finance Dash Pro
- Datos de transacciones en tu cuenta

## 🔗 Conexión Directa (Recomendada)

### Paso 1: Obtener la URL del Endpoint

1. Inicia sesión en Finance Dash Pro
2. Ve a la sección **Power BI** en el menú lateral
3. Copia la URL del endpoint que aparece en la interfaz

### Paso 2: Conectar en Power BI Desktop

1. Abre Power BI Desktop
2. Haz clic en **Obtener datos** > **Web**
3. Pega la URL del endpoint en el campo de texto
4. Haz clic en **Aceptar**

### Paso 3: Configurar la Conexión

1. Selecciona **Delimitado** como tipo de archivo
2. Configura el delimitador como **coma (,)** 
3. Asegúrate de que **Primera fila como encabezados** esté marcado
4. Haz clic en **Cargar**

## 📊 Estructura de Datos

El dataset incluye las siguientes columnas optimizadas para Power BI:

### Campos de Fecha
- `Date`: Fecha de la transacción (YYYY-MM-DD)
- `Year`: Año
- `Month`: Mes (1-12)
- `MonthName`: Nombre del mes en español
- `Quarter`: Trimestre (1-4)
- `DayOfWeek`: Día de la semana (0-6)
- `DayOfWeekName`: Nombre del día en español

### Datos de Transacción
- `TransactionId`: Identificador único
- `Type`: Tipo (Ingreso/Gasto)
- `Amount`: Monto de la transacción
- `Category`: Nombre de la categoría
- `CategoryType`: Tipo de categoría (Ingreso/Gasto)
- `Description`: Descripción de la transacción
- `PaymentMethod`: Método de pago
- `Tags`: Etiquetas separadas por comas

### Campos Calculados
- `IsIncome`: Booleano para ingresos
- `IsExpense`: Booleano para gastos
- `AmountAbs`: Valor absoluto del monto

## 📈 Medidas DAX Recomendadas

Crea estas medidas en Power BI para análisis avanzados:

```dax
Total Ingresos = 
CALCULATE(
    SUM(transactions[Amount]), 
    transactions[Type] = "Ingreso"
)

Total Gastos = 
CALCULATE(
    SUM(transactions[Amount]), 
    transactions[Type] = "Gasto"
)

Balance = [Total Ingresos] - [Total Gastos]

Porcentaje Ahorro = 
DIVIDE([Balance], [Total Ingresos], 0)

Variación Mes Anterior = 
VAR CurrentMonth = MAX(transactions[Month])
VAR CurrentYear = MAX(transactions[Year])
VAR PreviousMonth = IF(CurrentMonth = 1, 12, CurrentMonth - 1)
VAR PreviousYear = IF(CurrentMonth = 1, CurrentYear - 1, CurrentYear)
VAR PreviousAmount = 
    CALCULATE(
        [Total Ingresos],
        transactions[Month] = PreviousMonth,
        transactions[Year] = PreviousYear
    )
RETURN
    DIVIDE([Total Ingresos] - PreviousAmount, PreviousAmount, 0)

Promedio Diario = 
DIVIDE([Total Gastos], DISTINCTCOUNT(transactions[Date]), 0)

Top Categoría = 
TOPN(1, 
    SUMMARIZE(transactions, transactions[Category], "Total", SUM(transactions[Amount])),
    [Total], DESC
)
```

## 🎨 Visualizaciones Recomendadas

### 1. Dashboard Principal
- **Tarjetas KPI**: Total Ingresos, Total Gastos, Balance, % Ahorro
- **Gráfico de líneas**: Evolución mensual de ingresos y gastos
- **Gráfico de barras apiladas**: Comparación mensual
- **Gráfico circular**: Distribución por categorías

### 2. Análisis Temporal
- **Gráfico de líneas**: Tendencias por trimestre
- **Matriz**: Desglose por categoría y mes
- **Gráfico de área**: Acumulado anual

### 3. Análisis de Categorías
- **Gráfico de barras horizontales**: Top 10 categorías
- **Gráfico de dispersión**: Relación entre frecuencia y monto
- **Tabla**: Ranking de categorías con variaciones

### 4. Análisis de Métodos de Pago
- **Gráfico circular**: Distribución por método de pago
- **Gráfico de barras**: Comparación mensual por método

## 🔄 Actualización de Datos

### Actualización Automática
1. En Power BI Desktop, ve a **Inicio** > **Actualizar**
2. Los datos se actualizarán desde el endpoint en tiempo real

### Programación de Actualizaciones
1. Publica tu informe en Power BI Service
2. Configura la actualización programada en **Configuración del conjunto de datos**
3. Establece la frecuencia deseada (diaria, semanal, etc.)

## 🎯 Casos de Uso Avanzados

### Análisis de Tendencias
- Identifica patrones estacionales en tus gastos
- Compara el rendimiento mes a mes
- Detecta anomalías en tus transacciones

### Optimización de Presupuesto
- Analiza el cumplimiento de presupuestos por categoría
- Identifica categorías con mayor variabilidad
- Planifica ajustes basados en tendencias históricas

### Análisis de Eficiencia
- Calcula el costo por transacción por método de pago
- Analiza la frecuencia de uso de cada categoría
- Optimiza la estructura de categorías

## 🚨 Solución de Problemas

### Error de Conexión
- Verifica que la URL del endpoint sea correcta
- Asegúrate de tener acceso a internet
- Comprueba que tu sesión en Finance Dash Pro esté activa

### Datos No Actualizados
- Refresca la conexión en Power BI Desktop
- Verifica que haya nuevas transacciones en Finance Dash Pro
- Comprueba la configuración de actualización programada

### Problemas de Formato
- Asegúrate de que el delimitador esté configurado como coma
- Verifica que la codificación sea UTF-8
- Comprueba que la primera fila contenga los encabezados

## 📞 Soporte

Si encuentras problemas con la integración:

1. Revisa esta documentación
2. Verifica la configuración de tu conexión
3. Contacta al soporte técnico con detalles específicos del error

---

**Nota**: Esta integración está optimizada para proporcionar datos en tiempo real y facilitar el análisis avanzado de tus finanzas personales.

