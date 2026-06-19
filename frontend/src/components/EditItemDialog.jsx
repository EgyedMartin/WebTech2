import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { CATEGORIES, STUDENTS, ROOMS } from "./AddItemForm";

export default function EditItemDialog({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(item || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(item || {});
  }, [item]);

  if (!item) return null;
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(item.id, {
        ...form,
        price: parseFloat(form.price || 0),
        stock: parseInt(form.stock || 0, 10),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg" data-testid="edit-item-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Tétel szerkesztése
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Név</Label>
            <Input
              required
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
              className="h-10 rounded-lg"
              data-testid="edit-name-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Cikkszám</Label>
            <Input
              required
              value={form.sku || ""}
              onChange={(e) => update("sku", e.target.value)}
              className="h-10 rounded-lg"
              data-testid="edit-sku-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Ár (HUF)</Label>
            <Input
              type="number"
              required
              value={form.price ?? ""}
              onChange={(e) => update("price", e.target.value)}
              className="h-10 rounded-lg"
              data-testid="edit-price-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Készlet</Label>
            <Input
              type="number"
              required
              value={form.stock ?? ""}
              onChange={(e) => update("stock", e.target.value)}
              className="h-10 rounded-lg"
              data-testid="edit-stock-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Státusz</Label>
            <Select
              value={form.status || "active"}
              onValueChange={(v) => update("status", v)}
            >
              <SelectTrigger className="h-10 rounded-lg" data-testid="edit-status-select">
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
              value={form.category || ""}
              onValueChange={(v) => update("category", v)}
            >
              <SelectTrigger className="h-10 rounded-lg" data-testid="edit-category-select">
                <SelectValue />
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
            <Select
              value={form.owner || ""}
              onValueChange={(v) => update("owner", v)}
            >
              <SelectTrigger className="h-10 rounded-lg" data-testid="edit-owner-select">
                <SelectValue />
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
            <Label className="text-xs font-medium text-slate-600">Szoba</Label>
            <Select
              value={form.dormitory_room || ""}
              onValueChange={(v) => update("dormitory_room", v)}
            >
              <SelectTrigger className="h-10 rounded-lg" data-testid="edit-room-select">
                <SelectValue />
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
          <DialogFooter className="col-span-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg"
              data-testid="edit-cancel-button"
            >
              Mégse
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20"
              data-testid="edit-save-button"
            >
              {saving ? "Mentés…" : "Mentés"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
