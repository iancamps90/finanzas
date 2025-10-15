import { Suspense } from 'react';
import { DashboardContent } from '@/features/dashboard/dashboard-content';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tus finanzas y métricas clave
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

