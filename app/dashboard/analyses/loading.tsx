export default function AnalysesLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-4 bg-muted/40 p-4 pt-18 sm:gap-5 md:gap-6 md:p-6 md:pt-6">
      <div className="h-24 animate-pulse rounded-2xl border border-border/70 bg-background/70 shadow-sm" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-border bg-card shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}
