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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface ReportData {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  transactionCount: number;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
    type: 'INCOME' | 'EXPENSE';
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }>;
}

export function ReportsContent() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedReport, setSelectedReport] = useState('summary');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockData: ReportData = {
        period: selectedPeriod,
        totalIncome: 45000,
        totalExpenses: 32000,
        balance: 13000,
        savingsRate: 28.9,
        transactionCount: 156,
        topCategories: [
          { name: 'Supermercado', amount: 3200, percentage: 10.0, type: 'EXPENSE' },
          { name: 'Nómina', amount: 25000, percentage: 55.6, type: 'INCOME' },
          { name: 'Transporte', amount: 1800, percentage: 5.6, type: 'EXPENSE' },
          { name: 'Ocio', amount: 2400, percentage: 7.5, type: 'EXPENSE' },
          { name: 'Freelance', amount: 8000, percentage: 17.8, type: 'INCOME' },
        ],
        monthlyTrend: [
          { month: 'Ene', income: 4000, expenses: 2800, balance: 1200 },
          { month: 'Feb', income: 4200, expenses: 3000, balance: 1200 },
          { month: 'Mar', income: 3800, expenses: 2600, balance: 1200 },
          { month: 'Abr', income: 4500, expenses: 3200, balance: 1300 },
          { month: 'May', income: 4800, expenses: 3400, balance: 1400 },
          { month: 'Jun', income: 4600, expenses: 3100, balance: 1500 },
        ],
      };
      
      setReportData(mockData);
    } catch (error) {
      toast.error('Error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/export/${format}?period=${selectedPeriod}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${selectedPeriod}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Reporte ${format.toUpperCase()} exportado`);
      } else {
        toast.error('Error al exportar el reporte');
      }
    } catch (error) {
      toast.error('Error al exportar el reporte');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No se pudieron cargar los datos del reporte</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecciona período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="12months">Últimos 12 meses</SelectItem>
              <SelectItem value="year">Año actual</SelectItem>
              <SelectItem value="all">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Resumen General</SelectItem>
              <SelectItem value="categories">Por Categorías</SelectItem>
              <SelectItem value="trends">Tendencias</SelectItem>
              <SelectItem value="detailed">Detallado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(reportData.totalIncome, 'EUR', 'es-ES')}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(reportData.totalExpenses, 'EUR', 'es-ES')}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${reportData.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(reportData.balance, 'EUR', 'es-ES')}
            </div>
            <p className="text-xs text-muted-foreground">
              Neto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ahorro</CardTitle>
            <PieChart className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {formatPercentage(reportData.savingsRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Del ingreso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.topCategories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant={category.type === 'INCOME' ? 'success' : 'destructive'}>
                      {category.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
                    </Badge>
                  </TableCell>
                  <TableCell className={category.type === 'INCOME' ? 'text-success' : 'text-destructive'}>
                    {formatCurrency(category.amount, 'EUR', 'es-ES')}
                  </TableCell>
                  <TableCell>{formatPercentage(category.percentage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Gastos</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.monthlyTrend.map((month, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell className="text-success">
                    {formatCurrency(month.income, 'EUR', 'es-ES')}
                  </TableCell>
                  <TableCell className="text-destructive">
                    {formatCurrency(month.expenses, 'EUR', 'es-ES')}
                  </TableCell>
                  <TableCell className={month.balance >= 0 ? 'text-success' : 'text-destructive'}>
                    {formatCurrency(month.balance, 'EUR', 'es-ES')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

