import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}

