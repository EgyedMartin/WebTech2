import { Users } from "lucide-react";

export default function StudentsSection({ items }) {
  // Group by owner
  const grouped = items.reduce((acc, it) => {
    const o = it.owner || "Ismeretlen";
    if (!acc[o]) acc[o] = { count: 0, value: 0 };
    acc[o].count += 1;
    acc[o].value += (it.price || 0) * (it.stock || 0);
    return acc;
  }, {});

  const owners = Object.entries(grouped).sort((a, b) => b[1].count - a[1].count);

  const formatHUF = (n) =>
    new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <section
      id="hallgatok"
      className="scroll-mt-28 bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 sm:p-8"
      data-testid="students-section"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-1">
            Hallgatók
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Felelős hallgatók
          </h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {owners.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">
          Nincs még hallgatóhoz rendelt tétel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {owners.map(([owner, data]) => (
            <div
              key={owner}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              data-testid={`student-card-${owner}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {owner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-sm truncate">
                  {owner}
                </div>
                <div className="text-xs text-slate-500">
                  {data.count} tétel · {formatHUF(data.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
