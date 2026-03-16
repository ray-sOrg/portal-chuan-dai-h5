import { Spinner } from '@/components/spinner';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Header Skeleton */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-8">
          <div className="text-center py-8">
            <Spinner />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-2 px-3">
              <div className="w-5 h-5 mb-1 bg-muted animate-pulse rounded" />
              <div className="w-8 h-3 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
