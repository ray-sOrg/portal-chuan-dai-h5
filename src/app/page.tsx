import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Placeholder } from "@/components/placeholder";
import { Spinner } from "@/components/spinner";
import { ThemeToggle } from "@/components/theme";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">川 · 傣</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container mx-auto space-y-8">
          <ErrorBoundary fallback={<Placeholder label="哦豁，炸了！" />}>
            <Suspense fallback={<Spinner />}>尽情期待</Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
