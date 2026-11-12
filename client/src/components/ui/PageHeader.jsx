import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "./Seo";

export default function PageHeader({ title, subtitle, crumb, description }) {
  return (
    <section className="relative overflow-hidden bg-night text-white py-14 md:py-20">
      <Seo title={title} description={description || subtitle} />
      {/* soft colored glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-brand/40 blur-3xl animate-blob" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-10 w-72 h-72 rounded-full bg-pop/25 blur-3xl animate-blob [animation-delay:-6s]" />
      <div className="wrap relative">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-night-fg mb-3">
            <Link to="/" className="hover:text-white transition">Home</Link> / {crumb || title}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold !text-white">{title}</h1>
          {subtitle && <p className="mt-4 text-base md:text-lg text-night-fg max-w-2xl">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
