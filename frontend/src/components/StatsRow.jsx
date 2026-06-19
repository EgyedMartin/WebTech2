import { Box, CheckCircle2, Tags, Wallet } from "lucide-react";

const formatHUF = (n) =>
  new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function StatsRow({ stats }) {
  const cards = [
    {
      label: "Összes Tétel",
      value: stats?.total_items ?? 0,
      icon: Box,
      iconBg: "bg-blue-50 text-blue-600",
      testid: "stat-total-items",
    },
    {
      label: "Aktív Tételek",
      value: stats?.active_items ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
      testid: "stat-active-items",
    },
    {
      label: "Kategóriák",
      value: stats?.categories ?? 0,
      icon: Tags,
      iconBg: "bg-violet-50 text-violet-600",
      testid: "stat-categories",
    },
    {
      label: "Leltár érték",
      value: formatHUF(stats?.total_value ?? 0),
      icon: Wallet,
      iconBg: "bg-amber-50 text-amber-600",
      testid: "stat-total-value",
      hint: "rántott hús kizárva",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-row">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/70 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            data-testid={c.testid}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {c.label}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBg}`}>
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 leading-tight">
              {c.value}
            </div>
            {c.hint && (
              <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                {c.hint}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
