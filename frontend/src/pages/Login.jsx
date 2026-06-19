import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@pkcentral.hu");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Sikeres bejelentkezés");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-lg tracking-tight">
              KOLI INVENTORY <span className="text-slate-400 font-medium">Kollégiumi Leltár</span>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              A kollégiumi leltár kezelése mostantól <span className="text-cyan-400">egyszerű és átlátható.</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-md">
              Tartsd nyilván a kollégiumi szobák felszerelését — hűtőtől a tanulóasztalig —
              egyetlen tiszta felületen.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Védett, JWT-alapú belépés</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
          data-testid="login-form"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Bejelentkezés
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Üdv újra a vezérlőpulton
            </h2>
            <p className="text-slate-500 text-sm">
              Lépj be admin fiókoddal a leltár kezeléséhez.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email cím
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pkcentral.hu"
                required
                className="h-11 rounded-lg"
                data-testid="login-email-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Jelszó
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 rounded-lg"
                data-testid="login-password-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
            data-testid="login-submit-button"
          >
            {loading ? "Belépés…" : "Bejelentkezés"}
          </Button>

          <div className="rounded-lg bg-slate-100 border border-slate-200 p-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Tesztfiók:</span>{" "}
            admin@pkcentral.hu / admin123
          </div>

          <p className="text-sm text-slate-500 text-center">
            Még nincs fiókod?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
              data-testid="goto-register-link"
            >
              Regisztrálj most
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
