import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Loader from "../../components/ui/Loader";
import api, { errMsg } from "../../services/api";

const empty = { title: "", category: "Web", author: "", excerpt: "", content: "", published: true };

export default function Posts() {
  const [posts, setPosts] = useState(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/posts/admin/all").then((r) => setPosts(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/posts", form);
      toast.success("Post saved");
      setForm(empty);
      load();
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  const toggle = async (p) => {
    try {
      await api.put(`/posts/${p._id}`, { published: !p.published });
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try { await api.delete(`/posts/${p._id}`); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid xl:grid-cols-2 gap-8">
      <form onSubmit={create} className="bg-surface rounded-xl shadow-md p-6 space-y-3 self-start">
        <h2 className="font-semibold text-lg">New post</h2>
        <input required value={form.title} onChange={set("title")} placeholder="Title" aria-label="Title" className="field" />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.category} onChange={set("category")} aria-label="Category" className="field">
            {["Web", "Mobile", "Design", "Business"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={form.author} onChange={set("author")} placeholder="Author" aria-label="Author" className="field" />
        </div>
        <input value={form.excerpt} onChange={set("excerpt")} placeholder="Short summary" aria-label="Summary" className="field" />
        <textarea required rows="8" value={form.content} onChange={set("content")} placeholder="Content (separate paragraphs with a blank line)" aria-label="Content" className="field" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish immediately</label>
        <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "Saving..." : "Save post"}</button>
      </form>

      <div>
        {!posts ? <Loader /> : !posts.length ? <p className="text-slate-500">No posts yet. Write your first one on the left.</p> : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p._id} className="bg-surface rounded-xl shadow-md p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.category} · {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => toggle(p)} className={`text-xs font-semibold rounded-full px-3 py-1 ${p.published ? "bg-brand/10 text-brand-dark" : "bg-slate-100 text-slate-500"}`}>
                  {p.published ? "Published" : "Draft"}
                </button>
                <button onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
