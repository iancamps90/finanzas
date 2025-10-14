import { Suspense } from 'react';
import { TransactionsPage } from '@/features/transactions/transactions-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-gradient">
          Transacciones
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus ingresos y gastos
        </p>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <TransactionsPage />
      </Suspense>
    </div>
  );
}
