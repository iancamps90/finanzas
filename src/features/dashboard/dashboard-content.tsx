import { KPICards } from '@/features/dashboard/kpi-cards';
import { ChartsSection } from '@/features/dashboard/charts-section';
import { RecentTransactions } from '@/features/dashboard/recent-transactions';
import { QuickActions } from '@/features/dashboard/quick-actions';

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts */}
      <ChartsSection />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

