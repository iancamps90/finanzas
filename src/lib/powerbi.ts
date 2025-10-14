export interface PowerBIConfig {
  publicAccess: boolean;
  baseUrl: string;
  endpoints: {
    transactions: string;
    categories: string;
    budgets: string;
  };
}

export function getPowerBIConfig(): PowerBIConfig {
  const isPublic = process.env.BI_PUBLIC === 'true';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    publicAccess: isPublic,
    baseUrl,
    endpoints: {
      transactions: `${baseUrl}/api/bi/transactions.csv`,
      categories: `${baseUrl}/api/bi/categories.csv`,
      budgets: `${baseUrl}/api/bi/budgets.csv`,
    },
  };
}

export function generatePowerBIUrl(endpoint: string, isPublic: boolean = false): string {
  const config = getPowerBIConfig();
  
  if (isPublic || config.publicAccess) {
    return endpoint;
  }
  
  // For private endpoints, you might want to include authentication
  // This is a simplified version - in production you'd want proper auth
  return endpoint;
}

export function getPowerBIHeaders(isPublic: boolean = false): Record<string, string> {
  if (isPublic) {
    return {
      'Content-Type': 'text/csv',
      'Access-Control-Allow-Origin': '*',
    };
  }
  
  return {
    'Content-Type': 'text/csv',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };
}

export function generatePowerBIInstructions(): string {
  return `
# Instrucciones para conectar con Power BI

## Opción 1: Conexión directa (Recomendada)

1. Abre Power BI Desktop
2. Ve a "Obtener datos" > "Web"
3. Ingresa la siguiente URL:
   ${getPowerBIConfig().endpoints.transactions}
4. Selecciona "Delimitado" como tipo de archivo
5. Configura el delimitador como "coma (,)"
6. Haz clic en "Cargar"

## Opción 2: Descarga manual

1. Descarga el archivo CSV desde la aplicación
2. En Power BI Desktop, ve a "Obtener datos" > "Texto/CSV"
3. Selecciona el archivo descargado
4. Configura la codificación como "UTF-8"
5. Haz clic en "Cargar"

## Configuración recomendada

- **Codificación**: UTF-8
- **Delimitador**: Coma (,)
- **Primera fila como encabezados**: Sí
- **Tipo de datos**: Automático

## Medidas DAX sugeridas

\`\`\`dax
Total Ingresos = CALCULATE(SUM(transactions[Amount]), transactions[Type] = "INCOME")
Total Gastos = CALCULATE(SUM(transactions[Amount]), transactions[Type] = "EXPENSE")
Balance = [Total Ingresos] - [Total Gastos]
Porcentaje Ahorro = DIVIDE([Balance], [Total Ingresos], 0)
\`\`\`

## Visualizaciones recomendadas

1. **Gráfico de líneas**: Evolución mensual de ingresos y gastos
2. **Gráfico de barras apiladas**: Comparación mensual
3. **Gráfico circular**: Distribución por categorías
4. **Matriz**: Desglose por categoría y mes
5. **Tarjetas KPI**: Totales y porcentajes clave
`;
}

export function generateExcelInstructions(): string {
  return `
# Instrucciones para Excel

## Importación de datos

1. Abre Excel
2. Ve a "Datos" > "Obtener datos" > "Desde archivo" > "Desde texto/CSV"
3. Selecciona el archivo CSV descargado
4. Configura:
   - **Codificación**: UTF-8
   - **Delimitador**: Coma
   - **Primera fila como encabezados**: Sí
5. Haz clic en "Cargar"

## Creación de Tablas Dinámicas

### Tabla 1: Resumen mensual
1. Selecciona todos los datos
2. Ve a "Insertar" > "Tabla dinámica"
3. Configura:
   - **Filas**: Mes, Año
   - **Columnas**: Tipo
   - **Valores**: Suma de Monto
4. Aplica formato de moneda

### Tabla 2: Análisis por categoría
1. Crea nueva tabla dinámica
2. Configura:
   - **Filas**: Categoría
   - **Columnas**: Tipo
   - **Valores**: Suma de Monto
3. Ordena por monto descendente

### Tabla 3: Métodos de pago
1. Crea nueva tabla dinámica
2. Configura:
   - **Filas**: Método de Pago
   - **Valores**: Suma de Monto, Recuento de Transacciones

## Gráficos recomendados

1. **Gráfico de líneas**: Evolución temporal
2. **Gráfico de barras**: Comparación por categoría
3. **Gráfico circular**: Distribución de gastos
4. **Gráfico combinado**: Ingresos vs Gastos

## Fórmulas útiles

\`\`\`excel
=SUMIFS(Monto,Tipo,"INCOME")  // Total ingresos
=SUMIFS(Monto,Tipo,"EXPENSE") // Total gastos
=SUMIFS(Monto,Categoría,"Supermercado") // Gastos por categoría
=AVERAGE(Monto) // Promedio de transacciones
\`\`\`
`;
}

