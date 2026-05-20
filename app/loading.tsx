export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Header skeleton */}
      <div className="h-14 bg-[var(--brand-dark)]" />
      {/* Hero skeleton */}
      <div className="h-[420px] bg-[var(--surface-warm)]" />
      {/* Content skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
        <div className="mx-auto h-6 w-48 rounded-full bg-black/6" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-[var(--radius-card)] bg-black/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
