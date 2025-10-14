import { Suspense } from 'react';
import { CategoriesPage } from '@/features/categories/categories-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Categories() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-gradient">
          Categorías
        </h1>
        <p className="text-muted-foreground">
          Organiza tus transacciones por categorías
        </p>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <CategoriesPage />
      </Suspense>
    </div>
  );
}
