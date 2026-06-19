import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, formatApiError, TOKEN_KEY } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("A két jelszó nem egyezik");
      return;
    }
    if (password.length < 6) {
      toast.error("A jelszónak legalább 6 karakteresnek kell lennie");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      toast.success("Sikeres regisztráció");
      // Force reload so AuthContext picks up the new token
      window.location.href = "/";
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
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-lg tracking-tight">
              KOLI INVENTORY{" "}
              <span className="text-slate-400 font-medium">Kollégiumi Leltár</span>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Csatlakozz a{" "}
              <span className="text-cyan-400">kollégiumi leltár</span> rendszerhez.
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-md">
              Készíts saját fiókot és kezdj el szobánként, hallgatónként rendet
              rakni a felszerelések között.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <UserPlus className="w-4 h-4" />
            <span>Új fiók létrehozása</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
          data-testid="register-form"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Regisztráció
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Hozz létre fiókot
            </h2>
            <p className="text-slate-500 text-sm">
              Pár másodperc, és máris használhatod a leltárt.
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
                placeholder="te@pelda.hu"
                required
                className="h-11 rounded-lg"
                data-testid="register-email-input"
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
                placeholder="Legalább 6 karakter"
                required
                minLength={6}
                className="h-11 rounded-lg"
                data-testid="register-password-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-slate-700 font-medium">
                Jelszó újra
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ismételd meg"
                required
                minLength={6}
                className="h-11 rounded-lg"
                data-testid="register-confirm-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
            data-testid="register-submit-button"
          >
            {loading ? "Regisztráció…" : "Fiók létrehozása"}
          </Button>

          <p className="text-sm text-slate-500 text-center">
            Már van fiókod?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
              data-testid="goto-login-link"
            >
              Bejelentkezés
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
