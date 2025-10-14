'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

// Mock data - will be replaced with real data from API
const mockData = [
  { month: 'Ene', ingresos: 4000, gastos: 2800 },
  { month: 'Feb', ingresos: 4200, gastos: 3000 },
  { month: 'Mar', ingresos: 3800, gastos: 2600 },
  { month: 'Abr', ingresos: 4500, gastos: 3200 },
  { month: 'May', ingresos: 4800, gastos: 3400 },
  { month: 'Jun', ingresos: 4600, gastos: 3100 },
  { month: 'Jul', ingresos: 5000, gastos: 3500 },
  { month: 'Ago', ingresos: 5200, gastos: 3600 },
  { month: 'Sep', ingresos: 4800, gastos: 3300 },
  { month: 'Oct', ingresos: 5100, gastos: 3400 },
  { month: 'Nov', ingresos: 4900, gastos: 3200 },
  { month: 'Dic', ingresos: 5300, gastos: 3800 },
];

export function MonthlyTrendChart() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, 'EUR', 'es-ES')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
          <XAxis 
            dataKey="month" 
            className="text-xs fill-muted-foreground"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis 
            className="text-xs fill-muted-foreground"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `€${value}`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="hsl(var(--success))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 8, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
            name="Ingresos"
          />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="hsl(var(--destructive))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 8, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
            name="Gastos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
