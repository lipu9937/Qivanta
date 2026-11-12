import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import { PostCard } from "../components/ui/Cards";
import useFetch from "../hooks/useFetch";

const cats = ["All", "Web", "Mobile", "Design", "Business"];

export default function Insights() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch("/posts", { q, page, limit: 6, category: category === "All" ? undefined : category });

  return (
    <>
      <PageHeader title="Blog" subtitle="Practical notes on building websites, apps and brands." />
      <section className="section bg-soft">
        <div className="wrap">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => { setCategory(c); setPage(1); }} aria-pressed={category === c}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${category === c ? "bg-brand text-white border-brand" : "bg-surface border-slate-200"}`}>{c}</button>
              ))}
            </div>
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search articles" aria-label="Search articles" className="field md:max-w-xs" />
          </div>
          {loading ? <Loader /> : !data?.items?.length ? <p className="text-center text-slate-500">No articles match. Try another category or search term.</p> : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{data.items.map((p, i) => <PostCard index={i} key={p._id} post={p} />)}</div>
          )}
          {data?.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline !py-2 disabled:opacity-40">Previous</button>
              <span className="text-sm">Page {data.page} of {data.pages}</span>
              <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="btn-outline !py-2 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
