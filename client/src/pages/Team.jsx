import { Linkedin, Globe } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import Reveal from "../components/ui/Reveal";
import useFetch from "../hooks/useFetch";

export default function Team() {
  const { data, loading } = useFetch("/team");
  return (
    <>
      <PageHeader title="Our team" subtitle="The people you will work with." />
      <section className="section bg-soft">
        <div className="wrap">
          {loading ? <Loader /> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(data || []).map((m, i) => (
                <Reveal key={m._id} delay={(i % 4) * 0.08} className="h-full">
                <div className="card group p-6 text-center h-full">
                  {m.photo ? <img src={m.photo} alt={m.name} loading="lazy" className="w-28 h-28 rounded-2xl object-cover mx-auto mb-4 transition duration-300 group-hover:scale-105 group-hover:rotate-2" />
                    : <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand to-violet text-white text-3xl font-heading font-bold flex items-center justify-center mx-auto mb-4">{m.name[0]}</div>}
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  <p className="text-brand text-sm mb-3">{m.role}</p>
                  <p className="text-slate-600 text-sm mb-4">{m.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {m.skills?.map((s) => <span key={s} className="text-xs bg-soft rounded-md px-2 py-1">{s}</span>)}
                  </div>
                  <div className="flex justify-center gap-4 text-slate-500">
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="hover:text-brand"><Linkedin size={20} /></a>}
                    {m.portfolio && <a href={m.portfolio} target="_blank" rel="noreferrer" aria-label={`${m.name}'s portfolio`} className="hover:text-brand"><Globe size={20} /></a>}
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
