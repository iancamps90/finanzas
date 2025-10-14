'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Database, 
  Download, 
  Link, 
  QrCode,
  BarChart3,
  Activity,
  Brain,
  FileText,
  Settings
} from 'lucide-react';
import { showNotification } from '@/components/notification-toast';

export function PowerBIPage() {
  const [loading, setLoading] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bi/transactions.csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `powerbi-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification({
          title: 'Descarga exitosa',
          description: 'Archivo CSV descargado para Power BI',
          variant: 'success',
        });
      } else {
        throw new Error('Error al descargar');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'No se pudo descargar el archivo',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bi/transactions.json');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `powerbi-dataset-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification({
          title: 'Descarga exitosa',
          description: 'Dataset JSON descargado para Power BI',
          variant: 'success',
        });
      } else {
        throw new Error('Error al descargar');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'No se pudo descargar el dataset',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification({
      title: 'Copiado',
      description: 'URL copiada al portapapeles',
      variant: 'success',
    });
  };

  const publicUrl = `${window.location.origin}/api/bi/transactions.csv`;

  return (
    <div className="space-y-6">
      {/* Conexión directa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conexión Directa a Power BI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">URL de Conexión</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background border rounded text-sm">
                  {publicUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(publicUrl)}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Usa esta URL en Power BI para conectar directamente con tus datos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleDownloadCSV}
                disabled={loading}
                className="h-auto p-4"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Descargar CSV</div>
                    <div className="text-sm opacity-80">Para importación manual</div>
                  </div>
                </div>
              </Button>

              <Button 
                onClick={handleDownloadJSON}
                disabled={loading}
                variant="outline"
                className="h-auto p-4"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Descargar JSON</div>
                    <div className="text-sm opacity-80">Dataset estructurado</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características avanzadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Analytics Avanzado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Análisis predictivo y tendencias
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Actualización automática de datos
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Inteligencia artificial para insights
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Reportes Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generación automática de reportes
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              Conectores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integración con múltiples fuentes
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Personaliza tu experiencia
            </p>
            <Badge variant="secondary">Próximamente</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Guía de uso */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de Integración con Power BI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Conexión Web</h4>
              <p className="text-sm text-muted-foreground">
                En Power BI Desktop, ve a "Obtener datos" → "Web" y pega la URL de conexión.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Importación Manual</h4>
              <p className="text-sm text-muted-foreground">
                Descarga el archivo CSV y úsalo como fuente de datos en Power BI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. Configuración Recomendada</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Establece la fecha como tipo de datos</li>
                <li>• Configura el monto como decimal</li>
                <li>• Crea relaciones entre tablas</li>
                <li>• Aplica medidas DAX para cálculos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
