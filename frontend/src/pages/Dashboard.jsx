import { useCallback, useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import SystemOverview from "@/components/SystemOverview";
import StatsRow from "@/components/StatsRow";
import InventoryTable from "@/components/InventoryTable";
import EditItemDialog from "@/components/EditItemDialog";
import NewItemDialog from "@/components/NewItemDialog";
import StudentsSection from "@/components/StudentsSection";
import CategoriesSection from "@/components/CategoriesSection";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newOpen, setNewOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [inv, st] = await Promise.all([
        api.get("/inventory"),
        api.get("/stats"),
      ]);
      setItems(inv.data);
      setStats(st.data);
    } catch (err) {
      toast.error(formatApiError(err));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreate = async (payload) => {
    try {
      await api.post("/inventory", payload);
      toast.success("Tétel létrehozva");
      await refresh();
    } catch (err) {
      toast.error(formatApiError(err));
      throw err;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await api.put(`/inventory/${id}`, payload);
      toast.success("Tétel frissítve");
      await refresh();
    } catch (err) {
      toast.error(formatApiError(err));
      throw err;
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Biztosan törlöd a(z) "${item.name}" tételt?`)) return;
    try {
      await api.delete(`/inventory/${item.id}`);
      toast.success("Tétel törölve");
      await refresh();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const scrollToInventory = () => {
    document
      .getElementById("felszerelesek")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16" data-testid="dashboard-page">
      <Navbar onNewItem={() => setNewOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        <SystemOverview
          onAddItem={() => setNewOpen(true)}
          onDetails={scrollToInventory}
        />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-1">
            Áttekintés
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-5">
            Statisztika
          </h2>
          <StatsRow stats={stats} />
        </div>

        <section id="felszerelesek" className="scroll-mt-28">
          <InventoryTable
            items={items}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </section>

        <StudentsSection items={items} />

        <CategoriesSection items={items} />
      </main>

      <NewItemDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onSubmit={handleCreate}
      />

      <EditItemDialog
        open={!!editing}
        item={editing}
        onClose={() => setEditing(null)}
        onSave={handleUpdate}
      />
    </div>
  );
}
