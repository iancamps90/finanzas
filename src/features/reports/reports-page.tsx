'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Calendar,
  DollarSign,
  PieChart
} from 'lucide-react';
import { showNotification } from '@/components/notification-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

export function ReportsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/export/csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transacciones-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification({
          title: 'Exportación exitosa',
          description: 'El archivo CSV se ha descargado correctamente',
          variant: 'success',
        });
      } else {
        throw new Error('Error al exportar');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'No se pudo exportar el archivo CSV',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/export/pdf');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification({
          title: 'Exportación exitosa',
          description: 'El archivo PDF se ha descargado correctamente',
          variant: 'success',
        });
      } else {
        throw new Error('Error al exportar');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'No se pudo exportar el archivo PDF',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Exportación de datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportación de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Formatos Disponibles</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">CSV para Excel</p>
                      <p className="text-sm text-muted-foreground">
                        Datos listos para análisis en Excel
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExportCSV}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : <Download className="h-4 w-4" />}
                    Exportar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">PDF con Gráficos</p>
                      <p className="text-sm text-muted-foreground">
                        Reporte completo con visualizaciones
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExportPDF}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : <Download className="h-4 w-4" />}
                    Exportar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Power BI Integration</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <p className="font-medium">Conexión Directa</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conecta Power BI directamente con tus datos
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar para Power BI
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <PieChart className="h-5 w-5 text-orange-500" />
                    <p className="font-medium">Dataset JSON</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Datos estructurados para análisis avanzado
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar JSON
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Análisis Temporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Compara tus finanzas por períodos
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Ver Análisis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Tendencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Identifica patrones en tus gastos
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Ver Tendencias
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Comparativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Compara categorías y métodos de pago
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Ver Comparativas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">CSV para Excel</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Incluye todas las transacciones con fechas formateadas</li>
                <li>• Categorías y métodos de pago normalizados</li>
                <li>• Listo para crear tablas dinámicas</li>
                <li>• Compatible con Power Query</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Power BI Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Conexión directa a la API</li>
                <li>• Actualización automática de datos</li>
                <li>• Modelo de datos optimizado</li>
                <li>• Medidas DAX predefinidas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
