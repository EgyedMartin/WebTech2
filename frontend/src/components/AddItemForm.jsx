import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

export const CATEGORIES = [
  "Konyhai eszköz",
  "Világítás",
  "Háztartás",
  "Bútor",
  "Elektronika",
  "Egyéb",
];

export const STUDENTS = [
  "Kovács Anna",
  "Nagy Bence",
  "Szabó Réka",
  "Tóth Levente",
  "Horváth Eszter",
  "Varga Máté",
  "Balogh Petra",
  "Konyha",
];

export const ROOMS = [
  "Miskolc Uni Dorm - Room 104",
  "Miskolc Uni Dorm - Room 210",
  "Miskolc Uni Dorm - Room 312",
  "Miskolc Uni Dorm - Room 408",
];

const EMPTY = {
  name: "",
  sku: "",
  price: "",
  stock: "",
  category: "",
  owner: "",
  dormitory_room: "",
  status: "active",
};

export default function AddItemForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price || 0),
        stock: parseInt(form.stock || 0, 10),
      });
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 sm:p-7 shadow-sm border border-slate-200/70"
      data-testid="add-item-form"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-1">
            Új bejegyzés
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Új tétel hozzáadása
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-slate-600">
            Név
          </Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="pl. Mini Hűtő"
            className="h-10 rounded-lg"
            data-testid="form-name-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sku" className="text-xs font-medium text-slate-600">
            Cikkszám (SKU)
          </Label>
          <Input
            id="sku"
            required
            value={form.sku}
            onChange={(e) => update("sku", e.target.value)}
            placeholder="DRM-XXX-000"
            className="h-10 rounded-lg"
            data-testid="form-sku-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price" className="text-xs font-medium text-slate-600">
            Ár (HUF)
          </Label>
          <Input
            id="price"
            type="number"
            required
            min="0"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0"
            className="h-10 rounded-lg"
            data-testid="form-price-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stock" className="text-xs font-medium text-slate-600">
            Készlet
          </Label>
          <Input
            id="stock"
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            placeholder="0"
            className="h-10 rounded-lg"
            data-testid="form-stock-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">Státusz</Label>
          <Select
            value={form.status}
            onValueChange={(v) => update("status", v)}
          >
            <SelectTrigger className="h-10 rounded-lg" data-testid="form-status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktív</SelectItem>
              <SelectItem value="inactive">Inaktív</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">Kategória</Label>
          <Select
            value={form.category}
            onValueChange={(v) => update("category", v)}
          >
            <SelectTrigger className="h-10 rounded-lg" data-testid="form-category-select">
              <SelectValue placeholder="Válassz kategóriát" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">Hallgató</Label>
          <Select value={form.owner} onValueChange={(v) => update("owner", v)}>
            <SelectTrigger className="h-10 rounded-lg" data-testid="form-owner-select">
              <SelectValue placeholder="Válassz hallgatót" />
            </SelectTrigger>
            <SelectContent>
              {STUDENTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">
            Kollégiumi Szoba
          </Label>
          <Select
            value={form.dormitory_room}
            onValueChange={(v) => update("dormitory_room", v)}
          >
            <SelectTrigger className="h-10 rounded-lg" data-testid="form-room-select">
              <SelectValue placeholder="pl. Miskolc Uni Dorm - Room 104" />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full mt-6 h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
        data-testid="form-submit-button"
      >
        <Save className="w-4 h-4 mr-1.5" />
        {saving ? "Mentés…" : "Mentés"}
      </Button>
    </form>
  );
}
