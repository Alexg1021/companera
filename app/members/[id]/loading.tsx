export default function MemberProfileLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-phone animate-pulse bg-white pb-32">
      <header className="flex items-center gap-2 border-b border-neutral-200 bg-brand-navy px-[18px] py-[10px]">
        <div className="h-[26px] w-[26px] rounded-[8px] bg-white/20" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-32 rounded bg-white/20" />
          <div className="h-2.5 w-24 rounded bg-white/15" />
        </div>
      </header>
      <div className="border-b border-neutral-200 px-[18px] py-4">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="mt-4 flex gap-3">
          <div className="h-11 w-11 rounded-full bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-neutral-200" />
            <div className="h-3 w-full max-w-xs rounded bg-neutral-200" />
            <div className="h-5 w-16 rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
      <div className="space-y-3 px-[18px] pt-4">
        <div className="h-16 rounded-lg bg-neutral-100" />
        <div className="h-28 rounded-lg bg-neutral-100" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-28 rounded bg-neutral-200" />
          <div className="h-12 rounded bg-neutral-100" />
          <div className="h-12 rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
