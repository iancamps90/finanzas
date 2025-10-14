import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyTrendChart } from '@/features/dashboard/monthly-trend-chart';
import { CategoryDistributionChart } from '@/features/dashboard/category-distribution-chart';

export function ChartsSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Evolución Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyTrendChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryDistributionChart />
        </CardContent>
      </Card>
    </div>
  );
}

