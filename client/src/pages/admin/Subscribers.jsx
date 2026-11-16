import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Trash2 } from "lucide-react";
import Loader from "../../components/ui/Loader";
import api, { errMsg } from "../../services/api";

// NEW: admin screen for newsletter subscribers (view, search, export CSV, delete)
export default function Subscribers() {
  const [subs, setSubs] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/subscribers").then((r) => setSubs(r.data)).catch((e) => toast.error(errMsg(e)));
  }, []);

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.email}?`)) return;
    try {
      await api.delete(`/subscribers/${s._id}`);
      setSubs((l) => l.filter((x) => x._id !== s._id));
    } catch (e) { toast.error(errMsg(e)); }
  };

  const shown = (subs || []).filter((s) => s.email.includes(q.toLowerCase().trim()));

  const exportCsv = () => {
    const csv = ["email,subscribedAt", ...shown.map((s) => `"${s.email}","${s.subscribedAt}"`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "qivanta-subscribers.csv";
    a.click();
  };

  if (!subs) return <Loader />;
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email" aria-label="Search subscribers" className="field max-w-xs" />
        <button onClick={exportCsv} disabled={!shown.length} className="btn-outline !py-2 disabled:opacity-40"><Download size={16} /> Export CSV</button>
        <span className="text-sm text-slate-500">{subs.length} total</span>
      </div>
      {!shown.length ? <p className="text-slate-500">No subscribers found.</p> : (
        <ul className="space-y-3 max-w-xl">
          {shown.map((s) => (
            <li key={s._id} className="bg-surface rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{s.email}</p>
                <p className="text-xs text-slate-500">{new Date(s.subscribedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(s)} aria-label={`Remove ${s.email}`} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
