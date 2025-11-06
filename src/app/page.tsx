import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Placeholder } from "@/components/placeholder";
import { Spinner } from "@/components/spinner";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-y-8 min-h-screen">
      <ErrorBoundary fallback={<Placeholder label="哦豁，炸了！" />}>
        <Suspense fallback={<Spinner />}>
          <div>这里是标题</div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
