import { Suspense } from 'react';
import { AdvancedAnalytics } from '@/features/powerbi/advanced-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function AdvancedAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Power BI Advanced Analytics</h1>
        <p className="text-muted-foreground">
          Análisis avanzado con integración completa de Power BI
        </p>
      </div>

      <Suspense fallback={<AdvancedAnalyticsSkeleton />}>
        <AdvancedAnalytics />
      </Suspense>
    </div>
  );
}

