import { Suspense } from 'react';
import { AutomatedReports } from '@/features/powerbi/automated-reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function AutomatedReportsSkeleton() {
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
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AutomatedReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes Automatizados</h1>
        <p className="text-muted-foreground">
          Gestión de reportes programados y automatizados
        </p>
      </div>

      <Suspense fallback={<AutomatedReportsSkeleton />}>
        <AutomatedReports />
      </Suspense>
    </div>
  );
}

