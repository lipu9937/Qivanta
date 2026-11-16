import { useState } from "react";
import toast from "react-hot-toast";
import api, { errMsg } from "../../services/api";

// NEW: lets the admin change their own password (POST /api/auth/change-password)
export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error("New passwords do not match");
    setBusy(true);
    try {
      await api.post("/auth/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="bg-surface rounded-2xl border border-slate-200 p-6 space-y-3 max-w-md">
      <input type="password" required autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} placeholder="Current password" aria-label="Current password" className="field" />
      <input type="password" required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} placeholder="New password (min 8 characters)" aria-label="New password" className="field" />
      <input type="password" required minLength={8} autoComplete="new-password" value={form.confirm} onChange={set("confirm")} placeholder="Confirm new password" aria-label="Confirm new password" className="field" />
      <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "Saving..." : "Update password"}</button>
    </form>
  );
}
