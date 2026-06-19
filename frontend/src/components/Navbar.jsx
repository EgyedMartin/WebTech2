import { Boxes, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Felszerelések", target: "felszerelesek", id: "nav-equipments" },
  { label: "Hallgatók", target: "hallgatok", id: "nav-students" },
  { label: "Kategóriák", target: "kategoriak", id: "nav-categories" },
];

export default function Navbar({ onNewItem }) {
  const { user, logout } = useAuth();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-4 z-40 w-full px-4 sm:px-6">
      <header
        className="mx-auto max-w-6xl bg-slate-900/95 backdrop-blur-xl rounded-full shadow-lg shadow-slate-900/30 border border-white/5 pl-5 pr-2 py-2 flex items-center justify-between gap-4"
        data-testid="navbar"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0" data-testid="navbar-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/40">
            <Boxes className="w-4 h-4 text-white" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[14px] text-white tracking-tight">
              KOLI INVENTORY
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/80 font-semibold">
              Kollégiumi Leltár
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.target)}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              data-testid={link.id}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: CTA + user */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onNewItem}
            className="group flex items-center gap-1.5 pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
            data-testid="navbar-new-item-button"
          >
            <span className="hidden sm:inline">Új tétel</span>
            <span className="sm:hidden">Új</span>
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.6} />
            </span>
          </button>

          <button
            type="button"
            onClick={logout}
            title={`Kijelentkezés — ${user?.email || ""}`}
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            data-testid="navbar-logout-button"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
    </div>
  );
}
