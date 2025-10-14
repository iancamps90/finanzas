export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="fixed inset-y-0 left-0 z-50 w-16 lg:w-64 bg-card border-r">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b">
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex-1 space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="lg:ml-16 lg:ml-64">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-96 animate-pulse rounded bg-muted" />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-80 animate-pulse rounded-lg bg-muted" />
              <div className="h-80 animate-pulse rounded-lg bg-muted" />
            </div>

            {/* Table */}
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

