import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Seo from "../../components/ui/Seo";
import { useAuth } from "../../context/AuthContext";
import { errMsg } from "../../services/api";

export default function Login() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      nav("/admin");
    } catch (err) {
      toast.error(errMsg(err, "Could not sign in."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center p-6">
      <Seo title="Admin sign in" />
      <form onSubmit={submit} className="bg-surface w-full max-w-md p-8 rounded-2xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <input type="email" required placeholder="Email" aria-label="Email" className="field"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password" aria-label="Password" className="field"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
      </form>
    </main>
  );
}
