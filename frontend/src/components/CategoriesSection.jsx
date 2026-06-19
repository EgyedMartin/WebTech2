import { Tags } from "lucide-react";

export default function CategoriesSection({ items }) {
  const grouped = items.reduce((acc, it) => {
    const c = it.category || "Egyéb";
    if (!acc[c]) acc[c] = { count: 0, active: 0 };
    acc[c].count += 1;
    if (it.status === "active") acc[c].active += 1;
    return acc;
  }, {});

  const categories = Object.entries(grouped).sort((a, b) => b[1].count - a[1].count);
  const maxCount = Math.max(1, ...categories.map(([, d]) => d.count));

  return (
    <section
      id="kategoriak"
      className="scroll-mt-28 bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 sm:p-8"
      data-testid="categories-section"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-1">
            Kategóriák
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Kategóriánkénti megoszlás
          </h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <Tags className="w-5 h-5" />
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">
          Még nincsenek kategorizált tételek.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(([cat, data]) => {
            const pct = (data.count / maxCount) * 100;
            return (
              <div key={cat} data-testid={`category-row-${cat}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-800">{cat}</span>
                  <span className="text-xs text-slate-500">
                    {data.count} tétel · {data.active} aktív
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
