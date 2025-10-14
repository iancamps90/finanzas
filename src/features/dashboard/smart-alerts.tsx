'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  BellOff,
  Settings,
  Eye,
  Archive,
  Trash2,
  Filter,
  Search,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertCircle,
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'critical';
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  source: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  metadata: {
    value?: number;
    threshold?: number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    affectedUsers?: number;
    estimatedImpact?: string;
  };
  actions: {
    id: string;
    label: string;
    type: 'primary' | 'secondary' | 'destructive';
    action: () => void;
  }[];
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  frequency: 'immediate' | 'hourly' | 'daily';
  lastTriggered?: string;
  triggerCount: number;
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<string>('');

  useEffect(() => {
    fetchAlerts();
    fetchAlertRules();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const mockAlerts: SmartAlert[] = [
        {
          id: '1',
          type: 'critical',
          title: 'Revenue Drop Detected',
          message: 'Revenue has dropped by 15% compared to last week, exceeding the 10% threshold.',
          category: 'Financial',
          priority: 'critical',
          status: 'active',
          source: 'Revenue Analytics',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          metadata: {
            value: 125000,
            threshold: 150000,
            change: -15,
            trend: 'down',
            affectedUsers: 0,
            estimatedImpact: 'High - Potential revenue loss of €25,000',
          },
          actions: [
            {
              id: 'investigate',
              label: 'Investigar',
              type: 'primary',
              action: () => handleInvestigate('1'),
            },
            {
              id: 'acknowledge',
              label: 'Reconocer',
              type: 'secondary',
              action: () => handleAcknowledge('1'),
            },
          ],
        },
        {
          id: '2',
          type: 'warning',
          title: 'High Error Rate',
          message: 'API error rate has increased to 2.5%, above the 2% threshold.',
          category: 'Technical',
          priority: 'high',
          status: 'acknowledged',
          source: 'System Monitoring',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          acknowledgedBy: 'Carlos López',
          acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          metadata: {
            value: 2.5,
            threshold: 2.0,
            change: 0.5,
            trend: 'up',
            affectedUsers: 1250,
            estimatedImpact: 'Medium - User experience degradation',
          },
          actions: [
            {
              id: 'resolve',
              label: 'Resolver',
              type: 'primary',
              action: () => handleResolve('2'),
            },
            {
              id: 'dismiss',
              label: 'Descartar',
              type: 'destructive',
              action: () => handleDismiss('2'),
            },
          ],
        },
        {
          id: '3',
          type: 'info',
          title: 'Unusual Transaction Pattern',
          message: 'Detected unusual transaction pattern in the last hour with 340% increase in volume.',
          category: 'Security',
          priority: 'medium',
          status: 'active',
          source: 'Fraud Detection',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: {
            value: 340,
            threshold: 100,
            change: 240,
            trend: 'up',
            affectedUsers: 0,
            estimatedImpact: 'Low - Monitoring required',
          },
          actions: [
            {
              id: 'review',
              label: 'Revisar',
              type: 'primary',
              action: () => handleReview('3'),
            },
            {
              id: 'acknowledge',
              label: 'Reconocer',
              type: 'secondary',
              action: () => handleAcknowledge('3'),
            },
          ],
        },
        {
          id: '4',
          type: 'success',
          title: 'Performance Target Achieved',
          message: 'System performance has improved to 99.8% uptime, exceeding the 99.5% target.',
          category: 'Performance',
          priority: 'low',
          status: 'resolved',
          source: 'Performance Monitor',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          metadata: {
            value: 99.8,
            threshold: 99.5,
            change: 0.3,
            trend: 'up',
            affectedUsers: 5000,
            estimatedImpact: 'Positive - Improved user satisfaction',
          },
          actions: [
            {
              id: 'archive',
              label: 'Archivar',
              type: 'secondary',
              action: () => handleArchive('4'),
            },
          ],
        },
        {
          id: '5',
          type: 'warning',
          title: 'Database Connection Pool Exhaustion',
          message: 'Database connection pool is at 95% capacity, approaching the 100% limit.',
          category: 'Infrastructure',
          priority: 'high',
          status: 'active',
          source: 'Database Monitor',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          metadata: {
            value: 95,
            threshold: 100,
            change: 5,
            trend: 'up',
            affectedUsers: 0,
            estimatedImpact: 'High - Potential service disruption',
          },
          actions: [
            {
              id: 'scale',
              label: 'Escalar',
              type: 'primary',
              action: () => handleScale('5'),
            },
            {
              id: 'acknowledge',
              label: 'Reconocer',
              type: 'secondary',
              action: () => handleAcknowledge('5'),
            },
          ],
        },
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      toast.error('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertRules = async () => {
    try {
      const mockRules: AlertRule[] = [
        {
          id: '1',
          name: 'Revenue Drop Alert',
          description: 'Alert when revenue drops by more than 10%',
          category: 'Financial',
          condition: 'revenue_change < -10',
          threshold: -10,
          enabled: true,
          frequency: 'immediate',
          lastTriggered: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          triggerCount: 3,
        },
        {
          id: '2',
          name: 'High Error Rate',
          description: 'Alert when API error rate exceeds 2%',
          category: 'Technical',
          condition: 'error_rate > 2',
          threshold: 2,
          enabled: true,
          frequency: 'immediate',
          lastTriggered: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          triggerCount: 12,
        },
        {
          id: '3',
          name: 'Unusual Transaction Volume',
          description: 'Alert when transaction volume increases by more than 200%',
          category: 'Security',
          condition: 'transaction_volume_change > 200',
          threshold: 200,
          enabled: true,
          frequency: 'hourly',
          lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          triggerCount: 1,
        },
        {
          id: '4',
          name: 'Database Connection Pool',
          description: 'Alert when connection pool usage exceeds 90%',
          category: 'Infrastructure',
          condition: 'connection_pool_usage > 90',
          threshold: 90,
          enabled: true,
          frequency: 'immediate',
          lastTriggered: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          triggerCount: 5,
        },
      ];

      setRules(mockRules);
    } catch (error) {
      toast.error('Error al cargar reglas de alerta');
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                status: 'acknowledged' as const,
                acknowledgedBy: 'Usuario Actual',
                acknowledgedAt: new Date().toISOString()
              } 
            : alert
        )
      );
      toast.success('Alerta reconocida');
    } catch (error) {
      toast.error('Error al reconocer alerta');
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                status: 'resolved' as const,
                resolvedAt: new Date().toISOString()
              } 
            : alert
        )
      );
      toast.success('Alerta resuelta');
    } catch (error) {
      toast.error('Error al resolver alerta');
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'dismissed' as const } 
            : alert
        )
      );
      toast.success('Alerta descartada');
    } catch (error) {
      toast.error('Error al descartar alerta');
    }
  };

  const handleArchive = async (alertId: string) => {
    try {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alerta archivada');
    } catch (error) {
      toast.error('Error al archivar alerta');
    }
  };

  const handleInvestigate = (alertId: string) => {
    toast.info('Iniciando investigación...');
  };

  const handleReview = (alertId: string) => {
    toast.info('Revisando transacciones...');
  };

  const handleScale = (alertId: string) => {
    toast.info('Escalando recursos...');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'error': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info': return <Info className="h-5 w-5 text-info" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-success" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'acknowledged': return 'warning';
      case 'resolved': return 'success';
      case 'dismissed': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.status === filter
  );

  const selectedAlertData = alerts.find(a => a.id === selectedAlert);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Alertas Inteligentes</h2>
          <p className="text-muted-foreground">
            Sistema de alertas proactivo con IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAlerts} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'acknowledged', 'resolved'] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterType)}
          >
            {filterType === 'all' ? 'Todas' :
             filterType === 'active' ? 'Activas' :
             filterType === 'acknowledged' ? 'Reconocidas' : 'Resueltas'}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alertas ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedAlert === alert.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                          {alert.priority}
                        </Badge>
                        <Badge variant={getStatusColor(alert.status)} className="text-xs">
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{alert.category}</span>
                        <span>•</span>
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{new Date(alert.timestamp).toLocaleString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Detalles de la Alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAlertData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getAlertIcon(selectedAlertData.type)}
                  <h3 className="font-semibold">{selectedAlertData.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {selectedAlertData.message}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Valor Actual</div>
                    <div className="font-semibold">
                      {selectedAlertData.metadata.value?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Umbral</div>
                    <div className="font-semibold">
                      {selectedAlertData.metadata.threshold?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Impacto Estimado:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlertData.metadata.estimatedImpact}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Acciones Disponibles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlertData.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.type === 'primary' ? 'default' : 
                                action.type === 'destructive' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedAlertData.acknowledgedBy && (
                  <div className="text-xs text-muted-foreground">
                    Reconocido por: {selectedAlertData.acknowledgedBy} • 
                    {new Date(selectedAlertData.acknowledgedAt!).toLocaleString('es-ES')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona una alerta para ver los detalles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Reglas de Alerta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{rule.name}</h4>
                    <Badge variant={rule.enabled ? 'success' : 'secondary'} className="text-xs">
                      {rule.enabled ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Categoría: {rule.category}</span>
                    <span>•</span>
                    <span>Umbral: {rule.threshold}</span>
                    <span>•</span>
                    <span>Disparos: {rule.triggerCount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

