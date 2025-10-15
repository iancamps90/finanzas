import { Suspense } from 'react';
import { AIInsights } from '@/features/powerbi/ai-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function AIInsightsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights & Predictions</h1>
        <p className="text-muted-foreground">
          Análisis inteligente y predicciones basadas en IA
        </p>
      </div>

      <Suspense fallback={<AIInsightsSkeleton />}>
        <AIInsights />
      </Suspense>
    </div>
  );
}

