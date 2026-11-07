import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Pencil } from "lucide-react";
import Loader from "../../components/ui/Loader";
import api, { errMsg } from "../../services/api";

/**
 * Generic admin CRUD screen.
 * fields: [{ name, label, type: "text"|"textarea"|"list"|"number"|"checkbox"|"select", options?, required? }]
 * "list" fields are typed as comma-separated text and saved as arrays.
 */
export default function ResourceManager({ endpoint, noun, fields, titleOf, subOf }) {
  const blank = Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]));
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.get(endpoint).then((r) => setItems(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, [endpoint]);

  const edit = (item) => {
    setEditing(item._id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === "list" ? (item[f.name] || []).join(", ") : item[f.name] ?? (f.type === "checkbox" ? false : "")])));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => { setEditing(null); setForm(blank); };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {};
    fields.forEach((f) => {
      const v = form[f.name];
      payload[f.name] = f.type === "list" ? String(v).split(",").map((x) => x.trim()).filter(Boolean)
        : f.type === "number" ? Number(v) || 0 : v;
    });
    setBusy(true);
    try {
      editing ? await api.put(`${endpoint}/${editing}`, payload) : await api.post(endpoint, payload);
      toast.success(editing ? `${noun} updated` : `${noun} added`);
      reset();
      load();
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${titleOf(item)}"?`)) return;
    try { await api.delete(`${endpoint}/${item._id}`); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  const input = (f) => {
    const common = { id: f.name, "aria-label": f.label, className: "field", value: form[f.name], required: f.required, placeholder: f.label,
      onChange: (e) => setForm({ ...form, [f.name]: e.target.value }) };
    if (f.type === "textarea") return <textarea rows="4" {...common} />;
    if (f.type === "select") return <select {...common}><option value="">{f.label}</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>;
    if (f.type === "checkbox") return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} /> {f.label}
      </label>
    );
    if (f.type === "list") return <input {...common} placeholder={`${f.label} (comma separated)`} />;
    return <input type={f.type === "number" ? "number" : "text"} {...common} />;
  };

  return (
    <div className="grid xl:grid-cols-2 gap-8">
      <form onSubmit={submit} className="bg-surface rounded-2xl border border-slate-200 p-6 space-y-3 self-start">
        <h2 className="font-semibold text-lg">{editing ? `Edit ${noun}` : `Add ${noun}`}</h2>
        {fields.map((f) => <div key={f.name}>{input(f)}</div>)}
        <div className="flex gap-3">
          <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "Saving..." : editing ? "Save changes" : `Add ${noun}`}</button>
          {editing && <button type="button" onClick={reset} className="btn-outline">Cancel</button>}
        </div>
      </form>

      <div>
        {!items ? <Loader /> : !items.length ? <p className="text-slate-500">Nothing here yet. Add your first {noun} using the form.</p> : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it._id} className="bg-surface rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{titleOf(it)}</p>
                  <p className="text-xs text-slate-500 truncate">{subOf?.(it)}</p>
                </div>
                <button onClick={() => edit(it)} aria-label={`Edit ${titleOf(it)}`} className="text-slate-400 hover:text-brand"><Pencil size={16} /></button>
                <button onClick={() => remove(it)} aria-label={`Delete ${titleOf(it)}`} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
