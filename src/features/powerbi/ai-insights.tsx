'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Cpu,
  Database,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  data: {
    current: number;
    predicted: number;
    change: number;
  };
  recommendations: string[];
  timeframe: string;
  priority: number;
  tags: string[];
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'error';
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

interface PredictionData {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string>('');

  useEffect(() => {
    fetchAIInsights();
    fetchAIModels();
    fetchPredictions();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      // Mock AI insights data
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'opportunity',
          title: 'Oportunidad de Crecimiento en Q2',
          description: 'El análisis predictivo indica un potencial de crecimiento del 23% en ingresos para el próximo trimestre basado en tendencias históricas y patrones de mercado.',
          confidence: 87,
          impact: 'high',
          category: 'Revenue Growth',
          data: {
            current: 125000,
            predicted: 153750,
            change: 23,
          },
          recommendations: [
            'Aumentar la inversión en marketing digital',
            'Expandir el equipo de ventas',
            'Optimizar la estrategia de precios',
          ],
          timeframe: 'Q2 2024',
          priority: 1,
          tags: ['revenue', 'growth', 'marketing'],
        },
        {
          id: '2',
          type: 'risk',
          title: 'Riesgo de Churn de Clientes Premium',
          description: 'Detectado un patrón de comportamiento que sugiere un aumento del 15% en la tasa de abandono de clientes premium en los próximos 60 días.',
          confidence: 92,
          impact: 'high',
          category: 'Customer Retention',
          data: {
            current: 8.5,
            predicted: 9.8,
            change: 15,
          },
          recommendations: [
            'Implementar programa de retención proactivo',
            'Mejorar el soporte al cliente',
            'Ofrecer incentivos de fidelización',
          ],
          timeframe: '60 días',
          priority: 2,
          tags: ['churn', 'retention', 'premium'],
        },
        {
          id: '3',
          type: 'trend',
          title: 'Tendencia Emergente: Pagos Móviles',
          description: 'Análisis de comportamiento muestra un crecimiento exponencial en transacciones móviles, con un aumento del 340% en los últimos 6 meses.',
          confidence: 95,
          impact: 'medium',
          category: 'Payment Trends',
          data: {
            current: 35,
            predicted: 48,
            change: 37,
          },
          recommendations: [
            'Optimizar la experiencia móvil',
            'Implementar nuevas formas de pago',
            'Invertir en tecnología móvil',
          ],
          timeframe: '6 meses',
          priority: 3,
          tags: ['mobile', 'payments', 'trend'],
        },
        {
          id: '4',
          type: 'anomaly',
          title: 'Anomalía Detectada en Transacciones',
          description: 'Sistema detectó un patrón inusual en transacciones de alto valor durante las últimas 48 horas, requiriendo investigación inmediata.',
          confidence: 89,
          impact: 'high',
          category: 'Security',
          data: {
            current: 12,
            predicted: 3,
            change: 300,
          },
          recommendations: [
            'Revisar transacciones sospechosas',
            'Implementar alertas automáticas',
            'Reforzar medidas de seguridad',
          ],
          timeframe: '48 horas',
          priority: 1,
          tags: ['security', 'anomaly', 'fraud'],
        },
        {
          id: '5',
          type: 'prediction',
          title: 'Predicción de Demanda Estacional',
          description: 'Modelo predictivo anticipa un pico de demanda del 45% durante la temporada de verano, basado en datos históricos y factores externos.',
          confidence: 78,
          impact: 'medium',
          category: 'Demand Forecasting',
          data: {
            current: 1000,
            predicted: 1450,
            change: 45,
          },
          recommendations: [
            'Aumentar inventario',
            'Contratar personal temporal',
            'Optimizar cadena de suministro',
          ],
          timeframe: 'Verano 2024',
          priority: 4,
          tags: ['demand', 'seasonal', 'forecasting'],
        },
      ];

      setInsights(mockInsights);
    } catch (error) {
      toast.error('Error al cargar insights de IA');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIModels = async () => {
    try {
      const mockModels: AIModel[] = [
        {
          id: '1',
          name: 'Revenue Predictor v2.1',
          description: 'Modelo de predicción de ingresos basado en redes neuronales',
          accuracy: 94.2,
          lastTrained: '2024-01-10T14:30:00Z',
          status: 'active',
          metrics: {
            precision: 0.92,
            recall: 0.89,
            f1Score: 0.90,
          },
        },
        {
          id: '2',
          name: 'Churn Detection v1.8',
          description: 'Sistema de detección temprana de abandono de clientes',
          accuracy: 91.7,
          lastTrained: '2024-01-12T09:15:00Z',
          status: 'active',
          metrics: {
            precision: 0.88,
            recall: 0.93,
            f1Score: 0.90,
          },
        },
        {
          id: '3',
          name: 'Anomaly Detector v3.0',
          description: 'Detector de anomalías en transacciones financieras',
          accuracy: 96.8,
          lastTrained: '2024-01-14T16:45:00Z',
          status: 'training',
          metrics: {
            precision: 0.95,
            recall: 0.94,
            f1Score: 0.94,
          },
        },
        {
          id: '4',
          name: 'Demand Forecaster v2.3',
          description: 'Predicción de demanda estacional y tendencias',
          accuracy: 87.3,
          lastTrained: '2024-01-08T11:20:00Z',
          status: 'active',
          metrics: {
            precision: 0.85,
            recall: 0.89,
            f1Score: 0.87,
          },
        },
      ];

      setModels(mockModels);
    } catch (error) {
      toast.error('Error al cargar modelos de IA');
    }
  };

  const fetchPredictions = async () => {
    try {
      const mockPredictions: PredictionData[] = [
        { period: 'Ene', actual: 120000, predicted: 118000, confidence: 92 },
        { period: 'Feb', actual: 135000, predicted: 132000, confidence: 89 },
        { period: 'Mar', actual: 128000, predicted: 131000, confidence: 87 },
        { period: 'Abr', predicted: 145000, confidence: 85 },
        { period: 'May', predicted: 152000, confidence: 83 },
        { period: 'Jun', predicted: 158000, confidence: 81 },
        { period: 'Jul', predicted: 165000, confidence: 79 },
        { period: 'Ago', predicted: 172000, confidence: 77 },
      ];

      setPredictions(mockPredictions);
    } catch (error) {
      toast.error('Error al cargar predicciones');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-success" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'trend': return <BarChart3 className="h-5 w-5 text-info" />;
      case 'anomaly': return <Eye className="h-5 w-5 text-warning" />;
      case 'prediction': return <Target className="h-5 w-5 text-primary" />;
      default: return <Brain className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const selectedInsightData = insights.find(i => i.id === selectedInsight);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">AI Insights & Predictions</h2>
          <p className="text-muted-foreground">
            Análisis inteligente y predicciones basadas en IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAIInsights} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar Insights
          </Button>
        </div>
      </div>

      {/* AI Models Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Modelos de IA Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{model.name}</h4>
                  <Badge 
                    variant={model.status === 'active' ? 'success' : 
                             model.status === 'training' ? 'warning' : 'destructive'}
                  >
                    {model.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {model.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Precisión:</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>F1 Score:</span>
                    <span className="font-medium">{(model.metrics.f1Score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entrenado: {new Date(model.lastTrained).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Insights List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Insights Generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedInsight === insight.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedInsight(insight.id)}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant={getImpactColor(insight.impact)} className="text-xs">
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                          Confianza: {insight.confidence}%
                        </span>
                        <span className="text-muted-foreground">
                          {insight.timeframe}
                        </span>
                        <span className="text-muted-foreground">
                          Prioridad: {insight.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insight Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Detalles del Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInsightData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getInsightIcon(selectedInsightData.type)}
                  <h3 className="font-semibold">{selectedInsightData.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {selectedInsightData.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Valor Actual</div>
                    <div className="font-semibold">
                      {typeof selectedInsightData.data.current === 'number' && selectedInsightData.data.current > 1000
                        ? `€${selectedInsightData.data.current.toLocaleString()}`
                        : `${selectedInsightData.data.current}%`}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Predicción</div>
                    <div className="font-semibold">
                      {typeof selectedInsightData.data.predicted === 'number' && selectedInsightData.data.predicted > 1000
                        ? `€${selectedInsightData.data.predicted.toLocaleString()}`
                        : `${selectedInsightData.data.predicted}%`}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {selectedInsightData.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedInsightData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona un insight para ver los detalles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Predictions Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Predicciones de Ingresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {/* Chart would go here - using mock data for now */}
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Gráfico de predicciones (implementar con Recharts)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

