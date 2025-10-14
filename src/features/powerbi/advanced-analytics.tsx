'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Download,
  Share2,
  Settings,
  RefreshCw,
  Eye,
  Filter,
  Calendar,
  Target,
  Zap,
  Brain,
  Database,
  Cloud,
  BarChart,
  Activity,
  Layers,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';

interface PowerBIDataset {
  id: string;
  name: string;
  description: string;
  lastRefresh: string;
  size: string;
  status: 'active' | 'refreshing' | 'error';
  tables: string[];
  measures: string[];
  relationships: number;
}

interface PowerBIWorkspace {
  id: string;
  name: string;
  description: string;
  datasets: PowerBIDataset[];
  reports: number;
  dashboards: number;
  users: number;
}

interface AdvancedMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
}

export function AdvancedAnalytics() {
  const [workspaces, setWorkspaces] = useState<PowerBIWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<AdvancedMetric[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWorkspaces();
    fetchAdvancedMetrics();
  }, []);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from Power BI API
      const mockWorkspaces: PowerBIWorkspace[] = [
        {
          id: '1',
          name: 'Finance Analytics Pro',
          description: 'Workspace principal para análisis financiero avanzado',
          datasets: [
            {
              id: 'ds1',
              name: 'Financial Transactions',
              description: 'Dataset completo de transacciones financieras',
              lastRefresh: '2024-01-15T10:30:00Z',
              size: '2.3 GB',
              status: 'active',
              tables: ['transactions', 'categories', 'users', 'budgets'],
              measures: ['Total Revenue', 'Net Profit', 'Growth Rate', 'ROI'],
              relationships: 12,
            },
            {
              id: 'ds2',
              name: 'Market Analysis',
              description: 'Análisis de mercado y tendencias',
              lastRefresh: '2024-01-15T09:15:00Z',
              size: '1.8 GB',
              status: 'active',
              tables: ['market_data', 'competitors', 'trends'],
              measures: ['Market Share', 'Growth Potential', 'Risk Score'],
              relationships: 8,
            },
          ],
          reports: 15,
          dashboards: 8,
          users: 25,
        },
        {
          id: '2',
          name: 'Executive Dashboard',
          description: 'Dashboard ejecutivo con KPIs de alto nivel',
          datasets: [
            {
              id: 'ds3',
              name: 'Executive KPIs',
              description: 'Métricas ejecutivas y estratégicas',
              lastRefresh: '2024-01-15T11:00:00Z',
              size: '850 MB',
              status: 'refreshing',
              tables: ['kpis', 'strategic_goals', 'performance'],
              measures: ['Revenue Growth', 'Profit Margin', 'Customer Satisfaction'],
              relationships: 5,
            },
          ],
          reports: 6,
          dashboards: 3,
          users: 12,
        },
      ];
      
      setWorkspaces(mockWorkspaces);
    } catch (error) {
      toast.error('Error al cargar los workspaces de Power BI');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvancedMetrics = async () => {
    try {
      const mockMetrics: AdvancedMetric[] = [
        {
          name: 'Revenue Growth Rate',
          value: 15.8,
          change: 2.3,
          trend: 'up',
          category: 'Financial',
          description: 'Tasa de crecimiento de ingresos anual',
        },
        {
          name: 'Customer Lifetime Value',
          value: 2847.50,
          change: -1.2,
          trend: 'down',
          category: 'Customer',
          description: 'Valor de vida del cliente promedio',
        },
        {
          name: 'Operational Efficiency',
          value: 87.3,
          change: 5.1,
          trend: 'up',
          category: 'Operations',
          description: 'Eficiencia operacional medida',
        },
        {
          name: 'Market Penetration',
          value: 23.7,
          change: 0.8,
          trend: 'stable',
          category: 'Market',
          description: 'Penetración en el mercado objetivo',
        },
        {
          name: 'Risk Score',
          value: 12.4,
          change: -3.2,
          trend: 'down',
          category: 'Risk',
          description: 'Puntuación de riesgo calculada',
        },
        {
          name: 'Innovation Index',
          value: 76.9,
          change: 8.7,
          trend: 'up',
          category: 'Innovation',
          description: 'Índice de innovación y desarrollo',
        },
      ];
      
      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Error al cargar las métricas avanzadas');
    }
  };

  const handleRefreshDataset = async (datasetId: string) => {
    setRefreshStatus(prev => ({ ...prev, [datasetId]: 'refreshing' }));
    
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setRefreshStatus(prev => ({ ...prev, [datasetId]: 'completed' }));
      toast.success('Dataset actualizado exitosamente');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setRefreshStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[datasetId];
          return newStatus;
        });
      }, 2000);
    } catch (error) {
      setRefreshStatus(prev => ({ ...prev, [datasetId]: 'error' }));
      toast.error('Error al actualizar el dataset');
    }
  };

  const handleShareWorkspace = (workspaceId: string) => {
    toast.success('Enlace de compartir generado');
  };

  const handleExportDataset = (datasetId: string) => {
    toast.success('Dataset exportado exitosamente');
  };

  const selectedWorkspaceData = workspaces.find(w => w.id === selectedWorkspace);
  const selectedDatasetData = selectedWorkspaceData?.datasets.find(d => d.id === selectedDataset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Power BI Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Análisis avanzado con integración completa de Power BI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchWorkspaces} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Workspace Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Seleccionar Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      {workspace.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedWorkspaceData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Descripción:</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedWorkspaceData.description}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedWorkspaceData.reports}
                    </div>
                    <div className="text-xs text-muted-foreground">Reportes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedWorkspaceData.dashboards}
                    </div>
                    <div className="text-xs text-muted-foreground">Dashboards</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedWorkspaceData.users}
                    </div>
                    <div className="text-xs text-muted-foreground">Usuarios</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Seleccionar Dataset
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedDataset} onValueChange={setSelectedDataset}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un dataset" />
              </SelectTrigger>
              <SelectContent>
                {selectedWorkspaceData?.datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {dataset.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDatasetData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge 
                    variant={selectedDatasetData.status === 'active' ? 'success' : 
                             selectedDatasetData.status === 'refreshing' ? 'warning' : 'destructive'}
                  >
                    {selectedDatasetData.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tamaño:</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedDatasetData.size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Última actualización:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedDatasetData.lastRefresh).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Métricas Avanzadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => (
              <div
                key={metric.name}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {metric.category}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {typeof metric.value === 'number' && metric.value < 100 
                    ? `${metric.value}%` 
                    : `€${metric.value.toLocaleString()}`}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      metric.trend === 'up' ? 'text-success' :
                      metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} 
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {metric.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dataset Management */}
      {selectedDatasetData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Gestión de Dataset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tables */}
              <div>
                <h4 className="font-medium mb-3">Tablas ({selectedDatasetData.tables.length})</h4>
                <div className="space-y-2">
                  {selectedDatasetData.tables.map((table) => (
                    <div key={table} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{table}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measures */}
              <div>
                <h4 className="font-medium mb-3">Medidas ({selectedDatasetData.measures.length})</h4>
                <div className="space-y-2">
                  {selectedDatasetData.measures.map((measure) => (
                    <div key={measure} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{measure}</span>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => handleRefreshDataset(selectedDatasetData.id)}
                disabled={refreshStatus[selectedDatasetData.id] === 'refreshing'}
              >
                {refreshStatus[selectedDatasetData.id] === 'refreshing' ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualizar Dataset
              </Button>
              <Button variant="outline" onClick={() => handleShareWorkspace(selectedWorkspace)}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
              <Button variant="outline" onClick={() => handleExportDataset(selectedDatasetData.id)}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

