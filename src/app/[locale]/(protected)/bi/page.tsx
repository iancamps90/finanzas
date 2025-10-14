import { Suspense } from 'react';
import { PowerBIPage } from '@/features/powerbi/powerbi-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function PowerBI() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-gradient">
          Power BI Integration
        </h1>
        <p className="text-muted-foreground">
          Conecta tus datos con Power BI para análisis avanzados
        </p>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <PowerBIPage />
      </Suspense>
    </div>
  );
}
