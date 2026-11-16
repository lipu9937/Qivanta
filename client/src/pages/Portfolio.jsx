import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import { ProjectCard } from "../components/ui/Cards";
import useFetch from "../hooks/useFetch";

export default function Portfolio() {
  const { data, loading } = useFetch("/projects");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState(""); // NEW: search box
  const cats = ["All", ...new Set((data || []).map((p) => p.category).filter(Boolean))];
  return (
    <>
      <PageHeader title="Portfolio" subtitle="Websites, apps and brands we have built." />
      <section className="section bg-soft">
        <div className="wrap">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${cat === c ? "bg-brand text-white border-brand" : "bg-surface border-slate-200 hover:border-brand"}`}>{c}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" aria-label="Search projects" className="field md:max-w-xs" />
          </div>
          {loading ? <Loader /> : !data?.length ? <p className="text-slate-500">Projects will appear here once they are added in the admin dashboard.</p> : (
            (() => {
              const term = q.trim().toLowerCase();
              const list = data.filter((p) => (cat === "All" || p.category === cat) &&
                (!term || [p.title, p.client, p.description, ...(p.techStack || [])].filter(Boolean).join(" ").toLowerCase().includes(term)));
              return !list.length ? <p className="text-slate-500">No projects match your search.</p> : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((p, i) => <ProjectCard index={i} key={p._id} item={p} />)}
                </div>
              );
            })()
          )}
        </div>
      </section>
    </>
  );
}
