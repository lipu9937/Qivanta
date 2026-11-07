import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, MessageSquare, Layers, Receipt, LifeBuoy } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import Loader from "../ui/Loader";
import SectionTitle from "../ui/SectionTitle";
import Reveal from "../ui/Reveal";
import { ServiceCard, ProjectCard, PostCard } from "../ui/Cards";

export function ToolsStrip() {
  const tools = ["React", "Node.js", "MongoDB", "Flutter", "Figma", "Tailwind CSS", "Shopify", "Firebase"];
  // The list is rendered twice so the scrolling loop has no gap
  return (
    <section className="border-y border-slate-200 py-5 bg-surface overflow-hidden" aria-label="Technologies we use">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...tools, ...tools].map((t, i) => (
          <span key={i} aria-hidden={i >= tools.length} className="mx-6 sm:mx-10 flex items-center gap-3 text-slate-500 font-heading font-semibold text-sm whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand to-pop" /> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ServicesOverview() {
  const { data, loading, error } = useFetch("/services");
  return (
    <section className="section">
      <div className="wrap">
        <SectionTitle title="What we make" subtitle="Development and design under one roof." />
        {error && (
          <p className="text-center text-sm text-red-600 mb-6" role="alert">
            {error} Make sure the server and MongoDB are running, then run <code>npm run seed</code>.
          </p>
        )}
        {loading ? <Loader /> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data || []).slice(0, 6).map((s, i) => <ServiceCard index={i} key={s._id} service={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  const { data, loading } = useFetch("/projects");
  if (!loading && !data?.length) return null;
  return (
    <section className="section bg-soft">
      <div className="wrap">
        <SectionTitle title="Recent work" subtitle="A few projects we are proud of." />
        {loading ? <Loader /> : <div className="grid gap-6 md:grid-cols-3">{data.slice(0, 3).map((p, i) => <ProjectCard index={i} key={p._id} item={p} />)}</div>}
        <div className="text-center mt-10"><Link to="/portfolio" className="btn-outline">View all projects</Link></div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [["Brief", "A short call to agree goals, scope and budget."], ["Design", "Wireframes and visuals, reviewed with you each week."], ["Build", "Development in small milestones with live previews."], ["Launch and support", "Testing, go-live and help after release."]];
  return (
    <section className="section">
      <div className="wrap">
        <SectionTitle title="How a project runs" />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 0.1} className="h-full">
              <div className="card p-6 h-full">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-violet text-white font-bold flex items-center justify-center mb-4 shadow-glow">{i + 1}</span>
                <h3 className="font-semibold text-lg mb-2">{t}</h3>
                <p className="text-slate-600 text-sm">{d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhyTeam() {
  const items = [
    [MessageSquare, "One point of contact", "You talk to one person, not five freelancers."],
    [Layers, "Design and code together", "Designers and developers work side by side from day one."],
    [Receipt, "Fixed quotes", "You know the price before we start."],
    [LifeBuoy, "Support after launch", "We stay around for fixes and improvements."],
  ];
  return (
    <section className="section relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 w-80 h-80 rounded-full bg-brand/30 blur-3xl animate-blob" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-0 w-80 h-80 rounded-full bg-pop/20 blur-3xl animate-blob [animation-delay:-8s]" />
      <div className="wrap relative">
        <Reveal><h2 className="text-3xl md:text-4xl font-bold !text-white mb-10 md:mb-12 max-w-xl">Why hire a team instead of a single freelancer</h2></Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([I, t, d], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 transition duration-300 hover:bg-white/10 hover:-translate-y-1">
                <span className="inline-flex w-12 h-12 rounded-xl bg-white/10 items-center justify-center mb-4"><I className="text-pop" size={24} /></span>
                <h3 className="font-semibold text-lg mb-2 !text-white">{t}</h3>
                <p className="text-night-fg text-sm">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamPreview() {
  const { data, loading } = useFetch("/team");
  if (!loading && !data?.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <SectionTitle title="Meet the team" />
        {loading ? <Loader /> : (
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {data.slice(0, 4).map((m, i) => (
              <Reveal key={m._id} delay={i * 0.08}>
              <div className="text-center group">
                {m.photo ? <img src={m.photo} alt={m.name} loading="lazy" className="w-28 h-28 rounded-2xl object-cover mx-auto mb-3 transition duration-300 group-hover:scale-105 group-hover:rotate-2" />
                  : <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand to-violet text-white text-3xl font-heading font-bold flex items-center justify-center mx-auto mb-3 transition duration-300 group-hover:scale-105 group-hover:rotate-2">{m.name[0]}</div>}
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-slate-500">{m.role}</p>
              </div>
              </Reveal>
            ))}
          </div>
        )}
        <div className="text-center mt-10"><Link to="/team" className="btn-outline">About the team</Link></div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { data } = useFetch("/testimonials");
  const [i, setI] = useState(0);
  if (!data?.length) return null;
  const t = data[i % data.length];
  return (
    <section className="section bg-soft">
      <div className="wrap max-w-3xl text-center">
        <SectionTitle title="What clients say" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i % data.length} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-center gap-1 text-pop mb-4" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={20} fill="currentColor" />)}
            </div>
            <blockquote className="text-lg sm:text-xl text-ink font-medium">“{t.quote}”</blockquote>
            <p className="mt-5 font-semibold">{t.name}</p>
            <p className="text-sm text-slate-500">{[t.role, t.company].filter(Boolean).join(", ")}</p>
          </motion.div>
        </AnimatePresence>
        {data.length > 1 && (
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => setI(i - 1 + data.length)} className="p-2 rounded-full border border-slate-300 hover:border-brand" aria-label="Previous testimonial"><ChevronLeft size={18} /></button>
            <button onClick={() => setI(i + 1)} className="p-2 rounded-full border border-slate-300 hover:border-brand" aria-label="Next testimonial"><ChevronRight size={18} /></button>
          </div>
        )}
      </div>
    </section>
  );
}

export function LatestPosts() {
  const { data, loading } = useFetch("/posts", { limit: 3 });
  if (!loading && !data?.items?.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <SectionTitle title="From the blog" />
        {loading ? <Loader /> : <div className="grid gap-6 md:grid-cols-3">{data.items.map((p, i) => <PostCard index={i} key={p._id} post={p} />)}</div>}
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-violet to-pop bg-[length:200%_200%] animate-shimmer text-white py-14 md:py-20 text-center">
      <div aria-hidden="true" className="absolute inset-0 bg-dots opacity-20" />
      <Reveal className="wrap relative">
        <h2 className="text-3xl md:text-4xl font-bold !text-white">Have a project in mind?</h2>
        <p className="mt-3 text-white/90">Tell us what you need. You will get a quote within 24 hours.</p>
        <Link to="/contact" className="btn bg-white text-night hover:shadow-glow mt-8">Request a quote</Link>
      </Reveal>
    </section>
  );
}
