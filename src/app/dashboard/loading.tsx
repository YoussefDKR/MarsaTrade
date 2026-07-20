export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="h-80 rounded-xl bg-slate-200 lg:col-span-7" />
        <div className="h-80 rounded-xl bg-slate-200 lg:col-span-5" />
      </div>
    </div>
  );
}
