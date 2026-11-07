import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Trash2 } from "lucide-react";
import Loader from "../../components/ui/Loader";
import api, { errMsg } from "../../services/api";

export default function Leads() {
  const [leads, setLeads] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      api.get("/leads", { params: { q, status } }).then((r) => setLeads(r.data)).catch((e) => toast.error(errMsg(e)));
    }, 250);
    return () => clearTimeout(t);
  }, [q, status]);

  const setLeadStatus = async (id, next) => {
    try {
      const { data } = await api.patch(`/leads/${id}`, { status: next });
      setLeads((ls) => ls.map((l) => (l._id === id ? data : l)));
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this lead permanently?")) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads((ls) => ls.filter((l) => l._id !== id));
    } catch (e) { toast.error(errMsg(e)); }
  };

  const exportCsv = () => {
    const cols = ["name", "email", "phone", "company", "service", "budget", "timeline", "status", "message", "createdAt"];
    const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => cell(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "qivanta-leads.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company" aria-label="Search leads" className="field max-w-xs" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="field max-w-[10rem]">
          <option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
        </select>
        <button onClick={exportCsv} disabled={!leads?.length} className="btn-outline !py-2 disabled:opacity-40"><Download size={16} /> Export CSV</button>
      </div>
      {!leads ? <Loader /> : !leads.length ? <p className="text-slate-500">No leads yet. New contact form submissions will appear here.</p> : (
        <div className="bg-surface rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-slate-50 text-slate-500">
              <tr><th className="p-4">Name</th><th className="p-4">Contact</th><th className="p-4">Project</th><th className="p-4">Message</th><th className="p-4">Status</th><th className="p-4"><span className="sr-only">Delete</span></th></tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-t border-slate-100 align-top">
                  <td className="p-4 font-medium">{l.name}<div className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString()}</div></td>
                  <td className="p-4">{l.email}<div className="text-xs text-slate-500">{l.phone}</div></td>
                  <td className="p-4">{l.service || "-"}<div className="text-xs text-slate-500">{[l.budget, l.timeline].filter(Boolean).join(" · ")}</div></td>
                  <td className="p-4 max-w-xs">{l.message}</td>
                  <td className="p-4">
                    <select value={l.status} onChange={(e) => setLeadStatus(l._id, e.target.value)} aria-label={`Status for ${l.name}`} className="border rounded-md px-2 py-1">
                      <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4"><button onClick={() => remove(l._id)} aria-label={`Delete ${l.name}`} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
