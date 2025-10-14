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
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Download,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Settings,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Send,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Database,
  Cloud,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomatedReport {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'financial' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  status: 'active' | 'paused' | 'error' | 'draft';
  lastRun: string;
  nextRun: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'powerpoint' | 'html';
  dataSources: string[];
  charts: string[];
  metrics: string[];
  createdBy: string;
  createdAt: string;
  successRate: number;
  avgGenerationTime: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  complexity: 'simple' | 'medium' | 'advanced';
  estimatedTime: string;
}

interface ReportExecution {
  id: string;
  reportId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  fileSize?: string;
  recipients: string[];
}

export function AutomatedReports() {
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [executions, setExecutions] = useState<ReportExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchTemplates();
    fetchExecutions();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const mockReports: AutomatedReport[] = [
        {
          id: '1',
          name: 'Reporte Ejecutivo Mensual',
          description: 'Resumen ejecutivo con KPIs principales y tendencias',
          type: 'executive',
          frequency: 'monthly',
          status: 'active',
          lastRun: '2024-01-15T09:00:00Z',
          nextRun: '2024-02-15T09:00:00Z',
          recipients: ['ceo@company.com', 'cfo@company.com', 'cto@company.com'],
          format: 'pdf',
          dataSources: ['Financial Data', 'Sales Data', 'Customer Data'],
          charts: ['Revenue Trend', 'Profit Margin', 'Customer Growth'],
          metrics: ['Total Revenue', 'Net Profit', 'Customer Acquisition Cost'],
          createdBy: 'Ana García',
          createdAt: '2024-01-01T10:00:00Z',
          successRate: 98.5,
          avgGenerationTime: 45,
        },
        {
          id: '2',
          name: 'Dashboard Operacional Diario',
          description: 'Métricas operacionales y alertas del día',
          type: 'operational',
          frequency: 'daily',
          status: 'active',
          lastRun: '2024-01-15T08:00:00Z',
          nextRun: '2024-01-16T08:00:00Z',
          recipients: ['ops@company.com', 'manager@company.com'],
          format: 'html',
          dataSources: ['Operations Data', 'System Metrics'],
          charts: ['System Performance', 'Error Rates', 'User Activity'],
          metrics: ['Uptime', 'Response Time', 'Active Users'],
          createdBy: 'Carlos López',
          createdAt: '2024-01-05T14:30:00Z',
          successRate: 99.2,
          avgGenerationTime: 12,
        },
        {
          id: '3',
          name: 'Análisis Financiero Semanal',
          description: 'Análisis detallado de finanzas y presupuestos',
          type: 'financial',
          frequency: 'weekly',
          status: 'paused',
          lastRun: '2024-01-08T10:00:00Z',
          nextRun: '2024-01-22T10:00:00Z',
          recipients: ['finance@company.com', 'accounting@company.com'],
          format: 'excel',
          dataSources: ['Accounting System', 'Bank Data', 'Invoice Data'],
          charts: ['Cash Flow', 'Budget vs Actual', 'Expense Breakdown'],
          metrics: ['Cash Position', 'Accounts Receivable', 'Expense Ratio'],
          createdBy: 'María Rodríguez',
          createdAt: '2023-12-15T16:00:00Z',
          successRate: 95.8,
          avgGenerationTime: 78,
        },
        {
          id: '4',
          name: 'Reporte de Ventas Personalizado',
          description: 'Análisis de ventas con segmentación por región',
          type: 'custom',
          frequency: 'weekly',
          status: 'error',
          lastRun: '2024-01-14T11:00:00Z',
          nextRun: '2024-01-21T11:00:00Z',
          recipients: ['sales@company.com', 'marketing@company.com'],
          format: 'powerpoint',
          dataSources: ['CRM Data', 'Sales Data', 'Marketing Data'],
          charts: ['Sales by Region', 'Conversion Funnel', 'Lead Sources'],
          metrics: ['Sales Volume', 'Conversion Rate', 'Average Deal Size'],
          createdBy: 'Pedro Martín',
          createdAt: '2024-01-10T09:15:00Z',
          successRate: 87.3,
          avgGenerationTime: 156,
        },
      ];

      setReports(mockReports);
    } catch (error) {
      toast.error('Error al cargar reportes automatizados');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const mockTemplates: ReportTemplate[] = [
        {
          id: '1',
          name: 'Executive Summary',
          description: 'Plantilla para reportes ejecutivos con KPIs principales',
          category: 'Executive',
          preview: 'Resumen ejecutivo con gráficos de tendencias y métricas clave',
          complexity: 'simple',
          estimatedTime: '15 min',
        },
        {
          id: '2',
          name: 'Financial Analysis',
          description: 'Análisis financiero completo con múltiples fuentes de datos',
          category: 'Financial',
          preview: 'Análisis de P&L, cash flow y ratios financieros',
          complexity: 'advanced',
          estimatedTime: '45 min',
        },
        {
          id: '3',
          name: 'Operational Dashboard',
          description: 'Dashboard operacional con métricas en tiempo real',
          category: 'Operations',
          preview: 'Métricas de rendimiento, alertas y KPIs operacionales',
          complexity: 'medium',
          estimatedTime: '25 min',
        },
        {
          id: '4',
          name: 'Sales Performance',
          description: 'Reporte de rendimiento de ventas con segmentación',
          category: 'Sales',
          preview: 'Análisis de ventas por región, producto y período',
          complexity: 'medium',
          estimatedTime: '30 min',
        },
        {
          id: '5',
          name: 'Customer Analytics',
          description: 'Análisis de comportamiento y satisfacción del cliente',
          category: 'Customer',
          preview: 'Métricas de satisfacción, retención y lifetime value',
          complexity: 'advanced',
          estimatedTime: '40 min',
        },
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      toast.error('Error al cargar plantillas');
    }
  };

  const fetchExecutions = async () => {
    try {
      const mockExecutions: ReportExecution[] = [
        {
          id: '1',
          reportId: '1',
          status: 'completed',
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-01-15T09:03:00Z',
          duration: 180,
          fileSize: '2.3 MB',
          recipients: ['ceo@company.com', 'cfo@company.com'],
        },
        {
          id: '2',
          reportId: '2',
          status: 'running',
          startTime: '2024-01-15T08:00:00Z',
          recipients: ['ops@company.com'],
        },
        {
          id: '3',
          reportId: '4',
          status: 'failed',
          startTime: '2024-01-14T11:00:00Z',
          endTime: '2024-01-14T11:02:30Z',
          duration: 150,
          error: 'Error de conexión con fuente de datos CRM',
          recipients: ['sales@company.com'],
        },
      ];

      setExecutions(mockExecutions);
    } catch (error) {
      toast.error('Error al cargar ejecuciones');
    }
  };

  const handleToggleReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      const newStatus = report.status === 'active' ? 'paused' : 'active';
      
      setReports(prev => 
        prev.map(r => 
          r.id === reportId ? { ...r, status: newStatus } : r
        )
      );

      toast.success(`Reporte ${newStatus === 'active' ? 'activado' : 'pausado'} exitosamente`);
    } catch (error) {
      toast.error('Error al cambiar estado del reporte');
    }
  };

  const handleRunReport = async (reportId: string) => {
    try {
      // Add new execution
      const newExecution: ReportExecution = {
        id: Math.random().toString(36).substr(2, 9),
        reportId,
        status: 'running',
        startTime: new Date().toISOString(),
        recipients: reports.find(r => r.id === reportId)?.recipients || [],
      };

      setExecutions(prev => [newExecution, ...prev]);
      toast.success('Reporte iniciado exitosamente');

      // Simulate completion after 3 seconds
      setTimeout(() => {
        setExecutions(prev => 
          prev.map(e => 
            e.id === newExecution.id 
              ? { 
                  ...e, 
                  status: 'completed', 
                  endTime: new Date().toISOString(),
                  duration: 180,
                  fileSize: '1.8 MB'
                } 
              : e
          )
        );
      }, 3000);
    } catch (error) {
      toast.error('Error al ejecutar reporte');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return;
    }

    try {
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar reporte');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'paused': return <Pause className="h-4 w-4 text-warning" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'draft': return <Edit className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'error': return 'destructive';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      default: return frequency;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'executive': return 'Ejecutivo';
      case 'operational': return 'Operacional';
      case 'financial': return 'Financiero';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  const selectedReportData = reports.find(r => r.id === selectedReport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Reportes Automatizados</h2>
          <p className="text-muted-foreground">
            Gestión de reportes programados y automatizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <Plus className="mr-2 h-4 w-4" />
            {showTemplates ? 'Ver Reportes' : 'Nuevo Reporte'}
          </Button>
          <Button variant="outline" onClick={fetchReports} disabled={loading}>
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
              <FileText className="h-5 w-5 text-primary" />
              Plantillas de Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Categoría: {template.category}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tiempo estimado: {template.estimatedTime}
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="mr-2 h-3 w-3" />
                      Crear Reporte
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Reportes Configurados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedReport === report.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <h4 className="font-medium text-sm">{report.name}</h4>
                    </div>
                    <Badge variant={getStatusColor(report.status)} className="text-xs">
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {report.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div>Tipo: {getTypeText(report.type)}</div>
                    <div>Frecuencia: {getFrequencyText(report.frequency)}</div>
                    <div>Formato: {report.format.toUpperCase()}</div>
                    <div>Destinatarios: {report.recipients.length}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Próxima ejecución: {new Date(report.nextRun).toLocaleString('es-ES')}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunReport(report.id);
                        }}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleReport(report.id);
                        }}
                      >
                        {report.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
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

        {/* Report Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Detalles del Reporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReportData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedReportData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedReportData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Tasa de Éxito</div>
                    <div className="font-semibold text-success">
                      {selectedReportData.successRate}%
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Tiempo Promedio</div>
                    <div className="font-semibold">
                      {selectedReportData.avgGenerationTime}s
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Fuentes de Datos:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedReportData.dataSources.map((source) => (
                      <Badge key={source} variant="secondary" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Gráficos Incluidos:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedReportData.charts.map((chart) => (
                      <Badge key={chart} variant="outline" className="text-xs">
                        {chart}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Destinatarios:</h4>
                  <div className="space-y-1">
                    {selectedReportData.recipients.map((email) => (
                      <div key={email} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {email}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Vista Previa
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Ahora
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona un reporte para ver los detalles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Ejecuciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executions.map((execution) => {
              const report = reports.find(r => r.id === execution.reportId);
              return (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {execution.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                    {execution.status === 'running' && <RefreshCw className="h-4 w-4 text-primary animate-spin" />}
                    {execution.status === 'failed' && <XCircle className="h-4 w-4 text-destructive" />}
                    <div>
                      <div className="font-medium text-sm">
                        {report?.name || 'Reporte desconocido'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(execution.startTime).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={execution.status === 'completed' ? 'success' : 
                                   execution.status === 'running' ? 'warning' : 'destructive'}>
                      {execution.status}
                    </Badge>
                    {execution.duration && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {execution.duration}s
                      </div>
                    )}
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

