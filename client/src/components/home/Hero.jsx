import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const swatches = ["#525AFF", "#8B5CF6", "#FF5E7D", "#0A0D1F"];

// Staggered entrance for the headline block
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

export default function Hero() {
  return (
    <section className="relative bg-soft overflow-hidden">
      {/* animated background: dotted grid + drifting color blobs */}
      <div aria-hidden="true" className="absolute inset-0 bg-dots opacity-70" />
      <div aria-hidden="true" className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-brand/25 blur-3xl animate-blob" />
      <div aria-hidden="true" className="absolute top-20 -right-24 w-[24rem] h-[24rem] rounded-full bg-violet/25 blur-3xl animate-blob [animation-delay:-5s]" />
      <div aria-hidden="true" className="absolute -bottom-32 left-1/3 w-[22rem] h-[22rem] rounded-full bg-pop/20 blur-3xl animate-blob [animation-delay:-10s]" />

      <div className="wrap relative py-14 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="inline-flex items-center gap-2 border border-slate-200 bg-surface/80 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6 shadow-soft">
            <Sparkles size={14} className="text-pop" /> A freelance team for websites, apps and brands
          </motion.p>
          <motion.h1 variants={item} className="text-[2.15rem] leading-[1.12] sm:text-5xl lg:text-6xl font-bold">
            Designers and developers, <span className="text-gradient">one team</span>, one point of contact.
          </motion.h1>
          <motion.p variants={item} className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl">
            We design, build and launch websites, mobile apps and brand identities, with fixed quotes and weekly updates.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/contact" className="btn-primary group">
              Request a quote <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/portfolio" className="btn-outline">See our work</Link>
          </motion.div>
        </motion.div>

        {/* Browser mock: a layout wireframe, a code card and a palette card */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.25 }}
          className="relative h-72 sm:h-[22rem] lg:h-[26rem] max-w-xl w-full mx-auto lg:max-w-none" aria-hidden="true">
          <div className="absolute inset-0 right-6 sm:right-8 bottom-10 bg-surface rounded-2xl border border-slate-200 shadow-glow overflow-hidden">
            <div className="flex gap-1.5 px-4 py-3 border-b border-slate-100">
              <i className="w-3 h-3 rounded-full bg-pop" /><i className="w-3 h-3 rounded-full bg-amber-300" /><i className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <div className="h-20 sm:h-24 rounded-lg bg-gradient-to-r from-brand via-violet to-pop bg-[length:200%_100%] animate-shimmer" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-14 sm:h-16 rounded-lg bg-soft" /><div className="h-14 sm:h-16 rounded-lg bg-soft" /><div className="h-14 sm:h-16 rounded-lg bg-soft" />
              </div>
              <div className="h-3 w-2/3 rounded bg-slate-200" /><div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 animate-float-slow">
            <div className="bg-night text-night-fg rounded-xl shadow-2xl border border-white/10 p-3 sm:p-4 font-mono text-[11px] sm:text-xs leading-6">
              <p><span className="text-pop">const</span> site = <span className="text-sky-300">build</span>({"{"}</p>
              <p className="pl-4">design: <span className="text-emerald-300">"done"</span>,</p>
              <p className="pl-4">launch: <span className="text-emerald-300">"on time"</span></p>
              <p>{"}"})</p>
            </div>
          </div>
          <div className="absolute top-12 -left-1 lg:-left-6 animate-float">
            <div className="bg-surface rounded-xl shadow-soft border border-slate-200 p-2.5 sm:p-3 flex gap-2">
              {swatches.map((c) => <span key={c} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200" style={{ background: c }} />)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
