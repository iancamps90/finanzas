'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Play,
  Pause,
  Square,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface RealTimeMetric {
  timestamp: string;
  value: number;
  change: number;
  status: 'normal' | 'warning' | 'critical';
}

interface RealTimeData {
  revenue: RealTimeMetric[];
  transactions: RealTimeMetric[];
  users: RealTimeMetric[];
  performance: RealTimeMetric[];
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export function RealTimeDashboard() {
  const [isConnected, setIsConnected] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    revenue: [],
    transactions: [],
    users: [],
    performance: [],
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    revenue: 0,
    transactions: 0,
    users: 0,
    performance: 0,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      startRealTimeUpdates();
    } else {
      stopRealTimeUpdates();
    }

    return () => stopRealTimeUpdates();
  }, [isPlaying]);

  const startRealTimeUpdates = () => {
    intervalRef.current = setInterval(() => {
      generateRealTimeData();
    }, 2000); // Update every 2 seconds
  };

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const generateRealTimeData = () => {
    const now = new Date();
    const timestamp = now.toISOString();

    // Generate realistic real-time data
    const newRevenue = {
      timestamp,
      value: Math.random() * 10000 + 50000,
      change: (Math.random() - 0.5) * 10,
      status: Math.random() > 0.8 ? 'warning' : 'normal' as const,
    };

    const newTransactions = {
      timestamp,
      value: Math.floor(Math.random() * 1000 + 500),
      change: (Math.random() - 0.5) * 20,
      status: Math.random() > 0.9 ? 'critical' : 'normal' as const,
    };

    const newUsers = {
      timestamp,
      value: Math.floor(Math.random() * 100 + 50),
      change: (Math.random() - 0.5) * 5,
      status: 'normal' as const,
    };

    const newPerformance = {
      timestamp,
      value: Math.random() * 100,
      change: (Math.random() - 0.5) * 5,
      status: Math.random() > 0.85 ? 'warning' : 'normal' as const,
    };

    setRealTimeData(prev => ({
      revenue: [...prev.revenue.slice(-19), newRevenue],
      transactions: [...prev.transactions.slice(-19), newTransactions],
      users: [...prev.users.slice(-19), newUsers],
      performance: [...prev.performance.slice(-19), newPerformance],
    }));

    setCurrentMetrics({
      revenue: newRevenue.value,
      transactions: newTransactions.value,
      users: newUsers.value,
      performance: newPerformance.value,
    });

    // Generate alerts based on data
    if (newRevenue.status === 'warning') {
      addAlert({
        type: 'warning',
        title: 'Revenue Alert',
        message: `Revenue dropped by ${Math.abs(newRevenue.change).toFixed(1)}%`,
      });
    }

    if (newTransactions.status === 'critical') {
      addAlert({
        type: 'error',
        title: 'Transaction Alert',
        message: `Transaction volume critical: ${newTransactions.value}`,
      });
    }
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only last 10 alerts
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{new Date(label).toLocaleTimeString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '🟢';
      default: return '🔵';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Dashboard en Tiempo Real</h2>
          <p className="text-muted-foreground">
            Monitoreo en vivo de métricas críticas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'destructive'} className="flex items-center gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleConnection}
          >
            {isConnected ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos en Vivo</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(currentMetrics.revenue, 'EUR', 'es-ES')}
            </div>
            <p className="text-xs text-muted-foreground">
              Actualizado hace 2 segundos
            </p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentMetrics.transactions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Por minuto
            </p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {currentMetrics.users.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En línea ahora
            </p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {currentMetrics.performance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tiempo de respuesta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Ingresos en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realTimeData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    tickFormatter={(value) => `€${value}`}
                    className="text-xs fill-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--success))"
                    fill="hsl(var(--success))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Transacciones por Minuto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realTimeData.transactions}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Alertas en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay alertas activas
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    alert.acknowledged ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Marcar como leído
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

