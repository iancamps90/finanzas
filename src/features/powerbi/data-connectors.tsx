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
  Database, 
  Cloud, 
  Server, 
  FileText, 
  Globe, 
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Link,
  Key,
  Shield,
  Activity,
  Clock,
  BarChart3,
  GitBranch,
  Layers,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

interface DataConnector {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud' | 'web';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  description: string;
  lastSync: string;
  nextSync: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  dataSource: string;
  tables: number;
  records: number;
  size: string;
  credentials: {
    type: 'oauth' | 'api_key' | 'username_password' | 'certificate';
    status: 'valid' | 'expired' | 'invalid';
  };
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  schema: {
    tables: string[];
    lastUpdated: string;
  };
}

interface ConnectorTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  complexity: 'simple' | 'medium' | 'advanced';
  setupTime: string;
  features: string[];
}

interface SyncLog {
  id: string;
  connectorId: string;
  status: 'success' | 'error' | 'warning';
  startTime: string;
  endTime: string;
  duration: number;
  recordsProcessed: number;
  errors: number;
  message: string;
}

export function DataConnectors() {
  const [connectors, setConnectors] = useState<DataConnector[]>([]);
  const [templates, setTemplates] = useState<ConnectorTemplate[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchConnectors();
    fetchTemplates();
    fetchSyncLogs();
  }, []);

  const fetchConnectors = async () => {
    setLoading(true);
    try {
      const mockConnectors: DataConnector[] = [
        {
          id: '1',
          name: 'PostgreSQL - Main Database',
          type: 'database',
          status: 'connected',
          description: 'Base de datos principal con transacciones y usuarios',
          lastSync: '2024-01-15T10:30:00Z',
          nextSync: '2024-01-15T10:35:00Z',
          frequency: 'real-time',
          dataSource: 'postgresql://prod-db:5432/finance_app',
          tables: 12,
          records: 1250000,
          size: '2.3 GB',
          credentials: {
            type: 'username_password',
            status: 'valid',
          },
          performance: {
            avgResponseTime: 45,
            successRate: 99.8,
            errorRate: 0.2,
          },
          schema: {
            tables: ['users', 'transactions', 'categories', 'budgets', 'goals'],
            lastUpdated: '2024-01-15T10:30:00Z',
          },
        },
        {
          id: '2',
          name: 'Salesforce CRM',
          type: 'cloud',
          status: 'connected',
          description: 'Sistema CRM para datos de clientes y oportunidades',
          lastSync: '2024-01-15T09:15:00Z',
          nextSync: '2024-01-15T12:15:00Z',
          frequency: 'hourly',
          dataSource: 'https://company.salesforce.com',
          tables: 8,
          records: 45000,
          size: '850 MB',
          credentials: {
            type: 'oauth',
            status: 'valid',
          },
          performance: {
            avgResponseTime: 1200,
            successRate: 98.5,
            errorRate: 1.5,
          },
          schema: {
            tables: ['accounts', 'contacts', 'opportunities', 'leads'],
            lastUpdated: '2024-01-15T09:15:00Z',
          },
        },
        {
          id: '3',
          name: 'Google Analytics API',
          type: 'api',
          status: 'syncing',
          description: 'Datos de tráfico web y comportamiento de usuarios',
          lastSync: '2024-01-15T08:00:00Z',
          nextSync: '2024-01-15T14:00:00Z',
          frequency: 'daily',
          dataSource: 'https://analytics.google.com/analytics/web',
          tables: 5,
          records: 125000,
          size: '320 MB',
          credentials: {
            type: 'oauth',
            status: 'valid',
          },
          performance: {
            avgResponseTime: 800,
            successRate: 97.2,
            errorRate: 2.8,
          },
          schema: {
            tables: ['sessions', 'pageviews', 'events', 'conversions'],
            lastUpdated: '2024-01-15T08:00:00Z',
          },
        },
        {
          id: '4',
          name: 'Excel Files - Financial Reports',
          type: 'file',
          status: 'error',
          description: 'Archivos Excel con reportes financieros históricos',
          lastSync: '2024-01-14T16:00:00Z',
          nextSync: '2024-01-15T16:00:00Z',
          frequency: 'daily',
          dataSource: '/shared/financial-reports/',
          tables: 3,
          records: 0,
          size: '0 MB',
          credentials: {
            type: 'username_password',
            status: 'expired',
          },
          performance: {
            avgResponseTime: 0,
            successRate: 0,
            errorRate: 100,
          },
          schema: {
            tables: [],
            lastUpdated: '2024-01-14T16:00:00Z',
          },
        },
        {
          id: '5',
          name: 'Banking API - Open Banking',
          type: 'api',
          status: 'connected',
          description: 'API bancaria para datos de transacciones en tiempo real',
          lastSync: '2024-01-15T10:29:00Z',
          nextSync: '2024-01-15T10:31:00Z',
          frequency: 'real-time',
          dataSource: 'https://api.openbanking.com/v1',
          tables: 6,
          records: 89000,
          size: '180 MB',
          credentials: {
            type: 'api_key',
            status: 'valid',
          },
          performance: {
            avgResponseTime: 200,
            successRate: 99.9,
            errorRate: 0.1,
          },
          schema: {
            tables: ['accounts', 'transactions', 'balances', 'payments'],
            lastUpdated: '2024-01-15T10:29:00Z',
          },
        },
      ];

      setConnectors(mockConnectors);
    } catch (error) {
      toast.error('Error al cargar conectores de datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const mockTemplates: ConnectorTemplate[] = [
        {
          id: '1',
          name: 'PostgreSQL',
          description: 'Conector para bases de datos PostgreSQL',
          category: 'Database',
          icon: '🐘',
          complexity: 'simple',
          setupTime: '5 min',
          features: ['Real-time sync', 'Full schema support', 'High performance'],
        },
        {
          id: '2',
          name: 'MySQL',
          description: 'Conector para bases de datos MySQL',
          category: 'Database',
          icon: '🐬',
          complexity: 'simple',
          setupTime: '5 min',
          features: ['Real-time sync', 'Full schema support', 'High performance'],
        },
        {
          id: '3',
          name: 'Salesforce',
          description: 'Conector para Salesforce CRM',
          category: 'CRM',
          icon: '☁️',
          complexity: 'medium',
          setupTime: '15 min',
          features: ['OAuth authentication', 'Custom objects', 'Bulk operations'],
        },
        {
          id: '4',
          name: 'Google Analytics',
          description: 'Conector para Google Analytics',
          category: 'Analytics',
          icon: '📊',
          complexity: 'medium',
          setupTime: '10 min',
          features: ['OAuth authentication', 'Multiple views', 'Custom dimensions'],
        },
        {
          id: '5',
          name: 'REST API',
          description: 'Conector genérico para APIs REST',
          category: 'API',
          icon: '🔗',
          complexity: 'advanced',
          setupTime: '30 min',
          features: ['Custom endpoints', 'Authentication methods', 'Data transformation'],
        },
        {
          id: '6',
          name: 'Excel/CSV',
          description: 'Conector para archivos Excel y CSV',
          category: 'File',
          icon: '📄',
          complexity: 'simple',
          setupTime: '5 min',
          features: ['Multiple formats', 'Auto-detection', 'Scheduled updates'],
        },
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      toast.error('Error al cargar plantillas');
    }
  };

  const fetchSyncLogs = async () => {
    try {
      const mockLogs: SyncLog[] = [
        {
          id: '1',
          connectorId: '1',
          status: 'success',
          startTime: '2024-01-15T10:30:00Z',
          endTime: '2024-01-15T10:30:45Z',
          duration: 45,
          recordsProcessed: 1250,
          errors: 0,
          message: 'Sincronización completada exitosamente',
        },
        {
          id: '2',
          connectorId: '2',
          status: 'success',
          startTime: '2024-01-15T09:15:00Z',
          endTime: '2024-01-15T09:17:30Z',
          duration: 150,
          recordsProcessed: 450,
          errors: 0,
          message: 'Datos de CRM actualizados',
        },
        {
          id: '3',
          connectorId: '4',
          status: 'error',
          startTime: '2024-01-14T16:00:00Z',
          endTime: '2024-01-14T16:00:15Z',
          duration: 15,
          recordsProcessed: 0,
          errors: 1,
          message: 'Error de autenticación: credenciales expiradas',
        },
        {
          id: '4',
          connectorId: '3',
          status: 'warning',
          startTime: '2024-01-15T08:00:00Z',
          endTime: '2024-01-15T08:05:20Z',
          duration: 320,
          recordsProcessed: 12500,
          errors: 3,
          message: 'Sincronización completada con advertencias',
        },
      ];

      setSyncLogs(mockLogs);
    } catch (error) {
      toast.error('Error al cargar logs de sincronización');
    }
  };

  const handleSyncConnector = async (connectorId: string) => {
    try {
      setConnectors(prev => 
        prev.map(c => 
          c.id === connectorId ? { ...c, status: 'syncing' } : c
        )
      );

      toast.success('Sincronización iniciada');

      // Simulate sync
      setTimeout(() => {
        setConnectors(prev => 
          prev.map(c => 
            c.id === connectorId ? { ...c, status: 'connected' } : c
          )
        );
        toast.success('Sincronización completada');
      }, 3000);
    } catch (error) {
      toast.error('Error al sincronizar conector');
    }
  };

  const handleDeleteConnector = async (connectorId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este conector?')) {
      return;
    }

    try {
      setConnectors(prev => prev.filter(c => c.id !== connectorId));
      toast.success('Conector eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar conector');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'disconnected': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'secondary';
      case 'error': return 'destructive';
      case 'syncing': return 'warning';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      case 'cloud': return <Cloud className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'oauth': return <Shield className="h-3 w-3" />;
      case 'api_key': return <Key className="h-3 w-3" />;
      case 'username_password': return <Key className="h-3 w-3" />;
      case 'certificate': return <Shield className="h-3 w-3" />;
      default: return <Key className="h-3 w-3" />;
    }
  };

  const selectedConnectorData = connectors.find(c => c.id === selectedConnector);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Conectores de Datos</h2>
          <p className="text-muted-foreground">
            Gestión de conexiones a fuentes de datos externas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <Plus className="mr-2 h-4 w-4" />
            {showTemplates ? 'Ver Conectores' : 'Nuevo Conector'}
          </Button>
          <Button variant="outline" onClick={fetchConnectors} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Templates Section */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Plantillas de Conectores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Complejidad:</span>
                      <Badge variant="secondary" className="text-xs">
                        {template.complexity}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tiempo:</span>
                      <span className="text-muted-foreground">{template.setupTime}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Características: {template.features.join(', ')}
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="mr-2 h-3 w-3" />
                      Configurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connectors List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Conectores Configurados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectors.map((connector) => (
                <div
                  key={connector.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedConnector === connector.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedConnector(connector.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(connector.type)}
                      <h4 className="font-medium text-sm">{connector.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(connector.status)}
                      <Badge variant={getStatusColor(connector.status)} className="text-xs">
                        {connector.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {connector.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div>Tablas: {connector.tables}</div>
                    <div>Registros: {connector.records.toLocaleString()}</div>
                    <div>Tamaño: {connector.size}</div>
                    <div>Frecuencia: {connector.frequency}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getCredentialIcon(connector.credentials.type)}
                      <span>Credenciales: {connector.credentials.status}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncConnector(connector.id);
                        }}
                        disabled={connector.status === 'syncing'}
                      >
                        <RefreshCw className={`h-3 w-3 ${connector.status === 'syncing' ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConnector(connector.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connector Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Detalles del Conector
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConnectorData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedConnectorData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConnectorData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Tiempo de Respuesta</div>
                    <div className="font-semibold">
                      {selectedConnectorData.performance.avgResponseTime}ms
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Tasa de Éxito</div>
                    <div className="font-semibold text-success">
                      {selectedConnectorData.performance.successRate}%
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Tablas Disponibles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedConnectorData.schema.tables.map((table) => (
                      <Badge key={table} variant="secondary" className="text-xs">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Información de Conexión:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuente:</span>
                      <span className="font-mono">{selectedConnectorData.dataSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última sincronización:</span>
                      <span>{new Date(selectedConnectorData.lastSync).toLocaleString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próxima sincronización:</span>
                      <span>{new Date(selectedConnectorData.nextSync).toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Probar Conexión
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Schema
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona un conector para ver los detalles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Logs de Sincronización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.map((log) => {
              const connector = connectors.find(c => c.id === log.connectorId);
              return (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {log.status === 'success' && <CheckCircle className="h-4 w-4 text-success" />}
                    {log.status === 'error' && <XCircle className="h-4 w-4 text-destructive" />}
                    {log.status === 'warning' && <AlertCircle className="h-4 w-4 text-warning" />}
                    <div>
                      <div className="font-medium text-sm">
                        {connector?.name || 'Conector desconocido'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.startTime).toLocaleString('es-ES')} - {log.message}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={log.status === 'success' ? 'success' : 
                                   log.status === 'error' ? 'destructive' : 'warning'}>
                      {log.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {log.recordsProcessed} registros • {log.duration}s
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

