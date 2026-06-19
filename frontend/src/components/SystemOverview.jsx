import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function SystemOverview({ onAddItem, onDetails }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-slate-900 text-white p-8 shadow-lg shadow-slate-900/10"
      data-testid="system-overview-card"
    >
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300 mb-5">
          <Sparkles className="w-3 h-3" />
          Rendszer áttekintés
        </div>
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight leading-[1.15] mb-2">
          A kollégiumi leltár kezelése
          <br />
          mostantól <span className="text-cyan-400">egyszerű és átlátható.</span>
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
          Kövesd nyomon a szobánkénti felszerelést, hallgatókat és állapotot — minden
          egy helyen.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAddItem}
            className="h-10 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-md shadow-cyan-500/30 transition-all duration-200 hover:-translate-y-0.5"
            data-testid="overview-add-item-button"
          >
            Új tétel
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button
            onClick={onDetails}
            className="h-10 px-4 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold border border-blue-800/60 transition-all duration-200 hover:-translate-y-0.5"
            data-testid="overview-details-button"
          >
            Részletek
          </Button>
        </div>
      </div>
    </div>
  );
}
