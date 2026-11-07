import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import { ServiceCard } from "../components/ui/Cards";
import useFetch from "../hooks/useFetch";

export default function Services() {
  const { data, loading, error } = useFetch("/services");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set((data || []).map((s) => s.category).filter(Boolean))];
  const list = (data || []).filter((s) => cat === "All" || s.category === cat);

  return (
    <>
      <PageHeader title="Services" subtitle="Practical advisory across strategy, technology, finance and people." />
      <section className="section bg-soft">
        <div className="wrap">
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${cat === c ? "bg-brand text-white border-brand" : "bg-surface border-slate-200 hover:border-brand"}`}>
                {c}
              </button>
            ))}
          </div>
          {loading ? <Loader /> : error ? <p className="text-red-600">{error}</p> : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((s, i) => <ServiceCard index={i} key={s._id} service={s} />)}</div>
          )}
        </div>
      </section>
    </>
  );
}
