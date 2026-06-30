export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-4 bg-muted/40 p-4 pt-18 sm:gap-5 md:gap-6 md:p-6 md:pt-6">
      <div className="h-20 animate-pulse rounded-2xl border border-border/70 bg-background/70 shadow-sm" />

      <section className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-border bg-card shadow-sm"
          />
        ))}
      </section>

      <main className="grid min-h-0 flex-1 grid-cols-12 gap-5 md:gap-6">
        <div className="col-span-12 flex min-h-0 flex-col gap-6 xl:col-span-8">
          <div className="min-h-80 flex-1 animate-pulse rounded-xl border border-border bg-card" />
          <div className="min-h-72 flex-1 animate-pulse rounded-xl border border-border bg-card" />
        </div>

        <div className="col-span-12 min-h-96 animate-pulse rounded-xl border border-border bg-card xl:col-span-4" />
      </main>
    </div>
  );
}
