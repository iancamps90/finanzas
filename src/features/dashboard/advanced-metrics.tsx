'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Users,
  Activity,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cloud,
  Cpu
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { toast } from 'sonner';

interface AdvancedMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
  icon: any;
  color: string;
  target?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdated: string;
  dataPoints: number[];
}

interface PerformanceIndicator {
  name: string;
  value: number;
  benchmark: number;
  status: 'above' | 'at' | 'below';
  trend: number[];
}

export function AdvancedMetrics() {
  const [metrics, setMetrics] = useState<AdvancedMetric[]>([]);
  const [performance, setPerformance] = useState<PerformanceIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  useEffect(() => {
    fetchAdvancedMetrics();
    fetchPerformanceIndicators();
  }, []);

  const fetchAdvancedMetrics = async () => {
    setLoading(true);
    try {
      const mockMetrics: AdvancedMetric[] = [
        {
          id: '1',
          name: 'Revenue Growth Rate',
          value: 15.8,
          change: 2.3,
          trend: 'up',
          category: 'Financial',
          description: 'Tasa de crecimiento de ingresos anual',
          icon: TrendingUp,
          color: 'text-success',
          target: 12.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [8.2, 10.5, 12.1, 13.8, 15.8],
        },
        {
          id: '2',
          name: 'Customer Lifetime Value',
          value: 2847.50,
          change: -1.2,
          trend: 'down',
          category: 'Customer',
          description: 'Valor de vida del cliente promedio',
          icon: Users,
          color: 'text-info',
          target: 3000.0,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          dataPoints: [2650, 2720, 2780, 2820, 2847.50],
        },
        {
          id: '3',
          name: 'Operational Efficiency',
          value: 87.3,
          change: 5.1,
          trend: 'up',
          category: 'Operations',
          description: 'Eficiencia operacional medida',
          icon: Activity,
          color: 'text-primary',
          target: 85.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [78.5, 80.2, 82.1, 84.7, 87.3],
        },
        {
          id: '4',
          name: 'Market Penetration',
          value: 23.7,
          change: 0.8,
          trend: 'stable',
          category: 'Market',
          description: 'Penetración en el mercado objetivo',
          icon: Target,
          color: 'text-warning',
          target: 25.0,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          dataPoints: [22.1, 22.8, 23.2, 23.5, 23.7],
        },
        {
          id: '5',
          name: 'Risk Score',
          value: 12.4,
          change: -3.2,
          trend: 'down',
          category: 'Risk',
          description: 'Puntuación de riesgo calculada',
          icon: AlertTriangle,
          color: 'text-destructive',
          target: 15.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [18.2, 16.8, 15.1, 13.7, 12.4],
        },
        {
          id: '6',
          name: 'Innovation Index',
          value: 76.9,
          change: 8.7,
          trend: 'up',
          category: 'Innovation',
          description: 'Índice de innovación y desarrollo',
          icon: Brain,
          color: 'text-success',
          target: 70.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [65.2, 68.1, 70.8, 73.5, 76.9],
        },
        {
          id: '7',
          name: 'Data Quality Score',
          value: 94.2,
          change: 1.8,
          trend: 'up',
          category: 'Data',
          description: 'Calidad de los datos del sistema',
          icon: Database,
          color: 'text-success',
          target: 90.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [89.1, 90.8, 92.1, 93.4, 94.2],
        },
        {
          id: '8',
          name: 'Cloud Performance',
          value: 99.1,
          change: 0.3,
          trend: 'up',
          category: 'Infrastructure',
          description: 'Rendimiento de la infraestructura en la nube',
          icon: Cloud,
          color: 'text-success',
          target: 99.0,
          status: 'excellent',
          lastUpdated: new Date().toISOString(),
          dataPoints: [98.2, 98.5, 98.8, 99.0, 99.1],
        },
      ];

      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Error al cargar métricas avanzadas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceIndicators = async () => {
    try {
      const mockPerformance: PerformanceIndicator[] = [
        {
          name: 'Response Time',
          value: 245,
          benchmark: 300,
          status: 'above',
          trend: [320, 310, 290, 260, 245],
        },
        {
          name: 'Uptime',
          value: 99.8,
          benchmark: 99.5,
          status: 'above',
          trend: [99.2, 99.4, 99.6, 99.7, 99.8],
        },
        {
          name: 'Error Rate',
          value: 0.2,
          benchmark: 0.5,
          status: 'above',
          trend: [0.8, 0.6, 0.4, 0.3, 0.2],
        },
        {
          name: 'Throughput',
          value: 1250,
          benchmark: 1000,
          status: 'above',
          trend: [950, 1000, 1100, 1200, 1250],
        },
      ];

      setPerformance(mockPerformance);
    } catch (error) {
      toast.error('Error al cargar indicadores de rendimiento');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const selectedMetricData = metrics.find(m => m.id === selectedMetric);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Métricas Avanzadas</h2>
          <p className="text-muted-foreground">
            KPIs avanzados y análisis de rendimiento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAdvancedMetrics} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.id}
            className={`kpi-card animate-slide-up cursor-pointer ${
              selectedMetric === metric.id ? 'ring-2 ring-primary' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <Badge variant={getStatusColor(metric.status)} className="text-xs">
                  {getStatusText(metric.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">
                {typeof metric.value === 'number' && metric.value < 100 
                  ? `${metric.value}%` 
                  : `€${metric.value.toLocaleString()}`}
              </div>
              <div className="flex items-center space-x-2 text-sm mb-2">
                {getTrendIcon(metric.trend)}
                <span
                  className={`font-medium ${
                    metric.trend === 'up' ? 'text-success' :
                    metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {metric.trend === 'up' ? '+' : ''}
                  {formatPercentage(Math.abs(metric.change))}
                </span>
                <span className="text-xs text-muted-foreground">vs anterior</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
              {metric.target && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Objetivo: {typeof metric.target === 'number' && metric.target < 100 
                      ? `${metric.target}%` 
                      : `€${metric.target.toLocaleString()}`}</span>
                    <span>Progreso: {((metric.value / metric.target) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Indicadores de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {performance.map((indicator, index) => (
              <div
                key={indicator.name}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{indicator.name}</h4>
                  <Badge 
                    variant={indicator.status === 'above' ? 'success' : 
                             indicator.status === 'at' ? 'info' : 'warning'}
                    className="text-xs"
                  >
                    {indicator.status === 'above' ? 'Superior' :
                     indicator.status === 'at' ? 'En línea' : 'Inferior'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {indicator.name === 'Uptime' || indicator.name === 'Error Rate' 
                    ? `${indicator.value}%` 
                    : indicator.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Benchmark: {indicator.name === 'Uptime' || indicator.name === 'Error Rate' 
                    ? `${indicator.benchmark}%` 
                    : indicator.benchmark.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metric Details */}
      {selectedMetricData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedMetricData.icon className="h-5 w-5 text-primary" />
              Detalles de {selectedMetricData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoría:</span>
                      <span>{selectedMetricData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge variant={getStatusColor(selectedMetricData.status)}>
                        {getStatusText(selectedMetricData.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última actualización:</span>
                      <span>{new Date(selectedMetricData.lastUpdated).toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Tendencia</h4>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(selectedMetricData.trend)}
                    <span className="text-sm">
                      {selectedMetricData.trend === 'up' ? 'Creciendo' :
                       selectedMetricData.trend === 'down' ? 'Decreciendo' : 'Estable'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({selectedMetricData.change > 0 ? '+' : ''}{formatPercentage(selectedMetricData.change)})
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Evolución Reciente</h4>
                <div className="space-y-2">
                  {selectedMetricData.dataPoints.map((point, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Período {index + 1}:</span>
                      <span className="font-medium">
                        {typeof point === 'number' && point < 100 
                          ? `${point}%` 
                          : `€${point.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Ver Gráfico
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
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

