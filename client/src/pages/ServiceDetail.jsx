import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import useFetch from "../hooks/useFetch";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: s, loading, error } = useFetch(`/services/${slug}`);

  if (loading) return <Loader />;
  if (error || !s) return <div className="wrap py-24 text-center"><p className="mb-4">{error || "Service not found."}</p><Link to="/services" className="btn-outline">All services</Link></div>;

  return (
    <>
      <PageHeader title={s.title} subtitle={s.shortDescription} crumb={`Services / ${s.title}`} />
      <section className="section">
        <div className="wrap grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div><h2 className="text-2xl font-bold mb-3">Overview</h2><p className="text-slate-600">{s.description}</p></div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Benefits</h2>
              <ul className="space-y-3">{s.benefits?.map((b) => <li key={b} className="flex gap-3"><Check className="text-brand shrink-0" size={20} /> {b}</li>)}</ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">How it works</h2>
              <ol className="space-y-4">
                {s.process?.map((p, i) => (
                  <li key={p.step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-pop text-night font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div><p className="font-semibold">{p.step}</p><p className="text-slate-600 text-sm">{p.detail}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            {!!s.faqs?.length && (
              <div>
                <h2 className="text-2xl font-bold mb-4">FAQ</h2>
                <div className="space-y-3">
                  {s.faqs.map((f) => (
                    <details key={f.question} className="card p-5 group">
                      <summary className="font-semibold cursor-pointer">{f.question}</summary>
                      <p className="mt-3 text-slate-600 text-sm">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="self-start bg-soft rounded-2xl p-8 lg:sticky lg:top-28">
            <h3 className="text-xl font-semibold mb-3">Request this service</h3>
            <p className="text-slate-600 text-sm mb-6">Tell us about your project and we will send a fixed quote within 24 hours.</p>
            <Link to={`/contact?service=${encodeURIComponent(s.title)}`} className="btn-primary w-full">Request a quote</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
