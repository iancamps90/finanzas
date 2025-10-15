import { Suspense } from 'react';
import { EditTransactionForm } from '@/features/transactions/edit-transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function EditTransactionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface EditTransactionPageProps {
  params: {
    id: string;
  };
}

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Transacción</h1>
          <p className="text-muted-foreground">
            Modifica los detalles de la transacción
          </p>
        </div>
      </div>

      <Suspense fallback={<EditTransactionSkeleton />}>
        <EditTransactionForm transactionId={params.id} />
      </Suspense>
    </div>
  );
}

