export default function MembersListSkeleton() {
  return (
    <div className="mx-auto min-h-screen max-w-phone animate-pulse bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-brand-navy px-[18px] py-[10px]">
        <div className="flex items-center gap-2">
          <div className="h-[26px] w-[26px] rounded-[8px] bg-white/20" />
          <div className="space-y-1">
            <div className="h-3.5 w-28 rounded bg-white/20" />
            <div className="h-2.5 w-24 rounded bg-white/15" />
          </div>
        </div>
        <div className="h-8 w-16 rounded-lg bg-white/15" />
      </header>
      <div className="border-b border-neutral-200 px-[18px] pb-2 pt-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-neutral-200" />
            <div className="h-3 w-32 rounded bg-neutral-200" />
          </div>
          <div className="h-8 w-8 rounded-full bg-neutral-200" />
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
          <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
          <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
        </div>
      </div>
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-[18px] py-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-28 rounded bg-neutral-200" />
              <div className="h-2.5 w-36 rounded bg-neutral-200" />
            </div>
            <div className="h-5 w-14 shrink-0 rounded-full bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
