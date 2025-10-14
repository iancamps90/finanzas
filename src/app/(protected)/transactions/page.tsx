import { Suspense } from 'react';
import { TransactionsContent } from '@/features/transactions/transactions-content';
import { TransactionsSkeleton } from '@/components/transactions-skeleton';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transacciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus ingresos y gastos
          </p>
        </div>
      </div>

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}

