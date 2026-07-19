import { DashboardPage } from "@/components/DashboardPage";

export default function ReportsPage() {
  return (
    <DashboardPage>
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <p className="text-lg font-semibold text-slate-700">Reports</p>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Exportable PDF market reports and custom route analysis — coming in a future release.
        </p>
      </div>
    </DashboardPage>
  );
}
