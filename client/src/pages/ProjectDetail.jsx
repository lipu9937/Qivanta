import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Loader from "../components/ui/Loader";
import Seo from "../components/ui/Seo";
import useFetch from "../hooks/useFetch";

// NEW: case-study page for one portfolio project (/portfolio/:id)
export default function ProjectDetail() {
  const { id } = useParams();
  const { data: p, loading, error } = useFetch(`/projects/${id}`);

  if (loading) return <Loader />;
  if (error || !p) return (
    <div className="wrap py-24 text-center">
      <p className="mb-4">{error || "Project not found."}</p>
      <Link to="/portfolio" className="btn-outline">All projects</Link>
    </div>
  );

  return (
    <article className="wrap max-w-4xl py-16">
      <Seo title={p.title} description={p.description} />
      <Link to="/portfolio" className="text-brand text-sm inline-flex items-center gap-1"><ArrowLeft size={14} /> Back to portfolio</Link>
      {p.category && <p className="mt-6 text-sm text-brand font-semibold">{p.category}</p>}
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-2">{p.title}</h1>
      {p.client && <p className="text-slate-500 mb-8">Client: {p.client}</p>}

      {p.image ? (
        <img src={p.image} alt="" className="rounded-2xl w-full mb-10" />
      ) : (
        <div className="h-56 sm:h-72 rounded-2xl bg-gradient-to-br from-night to-brand mb-10" />
      )}

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5 text-lg text-slate-700">
          {(p.description || "").split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <aside className="card p-6 h-fit space-y-5 hover:!translate-y-0">
          {p.result && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Result</p>
              <p className="font-heading font-semibold text-brand">{p.result}</p>
            </div>
          )}
          {!!p.techStack?.length && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Tools used</p>
              <div className="flex flex-wrap gap-2">
                {p.techStack.map((t) => <span key={t} className="text-xs bg-soft rounded-md px-2 py-1">{t}</span>)}
              </div>
            </div>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-outline w-full">Visit live site <ArrowUpRight size={16} /></a>
          )}
        </aside>
      </div>

      <div className="mt-14 text-center">
        <p className="text-slate-600 mb-4">Want something similar?</p>
        <Link to="/contact" className="btn-primary">Request a quote</Link>
      </div>
    </article>
  );
}
