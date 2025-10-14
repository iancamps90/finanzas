import { Suspense } from 'react';
import { ReportsPage } from '@/features/reports/reports-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-gradient">
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Análisis detallados y exportación de datos
        </p>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <ReportsPage />
      </Suspense>
    </div>
  );
}
