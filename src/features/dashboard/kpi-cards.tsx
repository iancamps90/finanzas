import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface KPIData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  incomeChange: number;
  expensesChange: number;
  balanceChange: number;
  savingsChange: number;
}

interface KPICardsProps {
  data?: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  // Mock data for now - will be replaced with real data
  const mockData: KPIData = {
    totalIncome: 4500,
    totalExpenses: 3200,
    balance: 1300,
    savingsRate: 28.9,
    incomeChange: 12.5,
    expensesChange: -5.2,
    balanceChange: 35.8,
    savingsChange: 8.3,
  };

  const kpiData = data || mockData;

  const kpis = [
    {
      title: 'Total Ingresos',
      value: formatCurrency(kpiData.totalIncome, 'EUR', 'es-ES'),
      change: kpiData.incomeChange,
      icon: TrendingUp,
      description: 'Este mes',
    },
    {
      title: 'Total Gastos',
      value: formatCurrency(kpiData.totalExpenses, 'EUR', 'es-ES'),
      change: kpiData.expensesChange,
      icon: TrendingDown,
      description: 'Este mes',
    },
    {
      title: 'Balance',
      value: formatCurrency(kpiData.balance, 'EUR', 'es-ES'),
      change: kpiData.balanceChange,
      icon: DollarSign,
      description: 'Neto',
    },
    {
      title: 'Tasa de Ahorro',
      value: formatPercentage(kpiData.savingsRate),
      change: kpiData.savingsChange,
      icon: Target,
      description: 'Del ingreso',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.change > 0;
        const isNegative = kpi.change < 0;

        return (
          <Card key={kpi.title} className="kpi-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span
                  className={`inline-flex items-center font-medium ${
                    isPositive
                      ? 'text-success'
                      : isNegative
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {isPositive && '+'}
                  {formatPercentage(Math.abs(kpi.change))}
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
