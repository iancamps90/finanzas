'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Database,
  QrCode,
} from 'lucide-react';
import { toast } from 'sonner';
import { getPowerBIConfig, generatePowerBIInstructions, generateExcelInstructions } from '@/lib/powerbi';

export function PowerBIContent() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);
  const config = getPowerBIConfig();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(config.endpoints.transactions);
      setCopiedUrl(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      toast.error('Error al copiar la URL');
    }
  };

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(generatePowerBIInstructions());
      setCopiedInstructions(true);
      toast.success('Instrucciones copiadas al portapapeles');
      setTimeout(() => setCopiedInstructions(false), 2000);
    } catch (error) {
      toast.error('Error al copiar las instrucciones');
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/bi/transactions.csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions_powerbi.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Archivo CSV descargado');
      } else {
        toast.error('Error al descargar el archivo');
      }
    } catch (error) {
      toast.error('Error al descargar el archivo');
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const response = await fetch('/api/bi/transactions.json');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions_powerbi.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Archivo JSON descargado');
      } else {
        toast.error('Error al descargar el archivo');
      }
    } catch (error) {
      toast.error('Error al descargar el archivo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado de la Integración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {config.publicAccess ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <AlertCircle className="h-5 w-5 text-warning" />
              )}
              <span className="font-medium">
                {config.publicAccess ? 'Acceso Público' : 'Acceso Privado'}
              </span>
            </div>
            <Badge variant={config.publicAccess ? 'success' : 'warning'}>
              {config.publicAccess ? 'Demo Mode' : 'Production Mode'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {config.publicAccess 
              ? 'Los endpoints están disponibles públicamente para demostración'
              : 'Los endpoints requieren autenticación para acceder a los datos'
            }
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Power BI Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Conexión Power BI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL del Endpoint</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                  {config.endpoints.transactions}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  disabled={copiedUrl}
                >
                  {copiedUrl ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Formato</label>
              <div className="flex gap-2">
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">UTF-8</Badge>
                <Badge variant="outline">Comma Separated</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acciones</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar JSON
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopyInstructions}
                disabled={copiedInstructions}
              >
                {copiedInstructions ? (
                  <CheckCircle className="mr-2 h-4 w-4 text-success" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copiar Instrucciones Power BI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Excel Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Integración Excel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Los archivos CSV están optimizados para importación directa en Excel
                con todas las columnas necesarias para análisis avanzados.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Características</label>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary">Tablas Dinámicas</Badge>
                <Badge variant="secondary">Power Query</Badge>
                <Badge variant="secondary">Gráficos</Badge>
                <Badge variant="secondary">Fórmulas DAX</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Columnas Incluidas</label>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Fechas (Date, Year, Month, Quarter)</div>
                <div>• Transacciones (Amount, Type, Category)</div>
                <div>• Métodos de pago y etiquetas</div>
                <div>• Campos calculados para análisis</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const instructions = generateExcelInstructions();
                  navigator.clipboard.writeText(instructions);
                  toast.success('Instrucciones de Excel copiadas');
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar Instrucciones Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de Inicio Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  1
                </div>
                <span className="font-medium">Conectar</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Copia la URL del endpoint y conéctala en Power BI Desktop
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  2
                </div>
                <span className="font-medium">Configurar</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Configura el tipo de archivo como CSV con delimitador de coma
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  3
                </div>
                <span className="font-medium">Analizar</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Crea visualizaciones y medidas DAX para análisis avanzados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

