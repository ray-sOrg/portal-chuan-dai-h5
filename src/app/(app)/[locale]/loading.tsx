import { Spinner } from '@/components/spinner';

export default function Loading() {
  return (
    <div className="-mt-[0.8rem] flex min-h-[calc(100dvh-10.25rem)] flex-1 flex-col bg-background pt-[0.8rem] text-foreground">
      <main className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    </div>
  );
}
