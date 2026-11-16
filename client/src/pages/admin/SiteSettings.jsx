import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import api, { errMsg } from "../../services/api";

// NEW: admin screen for the contact details and footer text shown on the website
const fields = [
  ["email", "Contact email", "hello@yourdomain.com"],
  ["phone", "Phone (optional)", "+1 234 567 890"],
  ["address", "Address (optional)", "City, Country"],
  ["hours", "Reply time / working hours", "We reply within 24 hours"],
];

export default function SiteSettings() {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setForm(r.data)).catch((e) => toast.error(errMsg(e)));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put("/settings", form);
      setForm(data);
      toast.success("Settings saved");
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  if (!form) return <Loader />;
  return (
    <form onSubmit={submit} className="bg-surface rounded-2xl border border-slate-200 p-6 space-y-4 max-w-xl">
      <p className="text-sm text-slate-500">These details appear in the website footer and on the Contact page. Leave a box empty to hide that line.</p>
      {fields.map(([k, label, ph]) => (
        <label key={k} className="block text-sm font-medium">
          {label}
          <input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={ph} className="field mt-1" />
        </label>
      ))}
      <label className="block text-sm font-medium">
        Footer description
        <textarea rows="3" value={form.footerText || ""} onChange={(e) => setForm({ ...form, footerText: e.target.value })} className="field mt-1" />
      </label>
      <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "Saving..." : "Save settings"}</button>
    </form>
  );
}
