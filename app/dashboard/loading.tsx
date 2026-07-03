export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto bg-muted/35 p-4 pt-18 sm:gap-4 md:p-5 md:pt-5 xl:overflow-hidden">
      <div className="h-[74px] shrink-0 animate-pulse rounded-xl border border-border/70 bg-background/85 shadow-sm" />

      <section className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-border/70 bg-card shadow-sm"
          />
        ))}
      </section>

      <main className="grid min-h-[620px] flex-1 grid-cols-12 gap-3 md:gap-4 xl:min-h-0">
        <div className="col-span-12 flex min-h-0 flex-col gap-3 md:gap-4 xl:col-span-8">
          <div className="min-h-64 flex-1 animate-pulse rounded-xl border border-border/70 bg-card" />
          <div className="min-h-72 flex-1 animate-pulse rounded-xl border border-border/70 bg-card" />
        </div>

        <div className="col-span-12 min-h-80 animate-pulse rounded-xl border border-border/70 bg-card xl:col-span-4 xl:min-h-0" />
      </main>
    </div>
  );
}
