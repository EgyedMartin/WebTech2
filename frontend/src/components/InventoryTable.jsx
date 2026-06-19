import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatHUF = (n) =>
  new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function InventoryTable({ items, onEdit, onDelete }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200/70 overflow-hidden"
      data-testid="inventory-table-card"
    >
      <div className="px-6 py-5 border-b border-slate-200/70 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-1">
            Termékek
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Leltár lista
          </h3>
        </div>
        <div className="text-sm text-slate-500" data-testid="inventory-count">
          {items.length} tétel
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className="bg-slate-50/70">
            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <th className="px-5 py-3 whitespace-nowrap">Név</th>
              <th className="px-3 py-3 whitespace-nowrap">Cikkszám</th>
              <th className="px-3 py-3 whitespace-nowrap">Ár</th>
              <th className="px-3 py-3 whitespace-nowrap">Készlet</th>
              <th className="px-3 py-3 whitespace-nowrap">Szoba</th>
              <th className="px-3 py-3 whitespace-nowrap">Kategória</th>
              <th className="px-3 py-3 whitespace-nowrap">Tulajdonos</th>
              <th className="px-3 py-3 whitespace-nowrap">Státusz</th>
              <th className="px-5 py-3 text-right whitespace-nowrap">Műveletek</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                  data-testid="inventory-empty"
                >
                  Még nincs egyetlen tétel sem.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                  data-testid={`inventory-row-${item.id}`}
                >
                  <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-3 py-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {item.sku}
                  </td>
                  <td className="px-3 py-4 text-slate-700 font-medium whitespace-nowrap">
                    {formatHUF(item.price)}
                  </td>
                  <td className="px-3 py-4 text-slate-700 whitespace-nowrap">{item.stock}</td>
                  <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
                    {item.dormitory_room}
                  </td>
                  <td className="px-3 py-4 text-slate-600 whitespace-nowrap">{item.category}</td>
                  <td className="px-3 py-4 text-slate-600 whitespace-nowrap">{item.owner}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        item.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                      data-testid={`status-badge-${item.id}`}
                    >
                      {item.status === "active" ? "aktív" : "inaktív"}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 shadow-none border-0"
                        data-testid={`edit-button-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Szerk.
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="h-8 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-none border-0"
                        data-testid={`delete-button-${item.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Töröl
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
