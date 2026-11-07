import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const links = [
  ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Portfolio", "/portfolio"],
  ["Team", "/team"], ["Blog", "/insights"], ["Contact", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after every navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-all duration-300 border-b ${
        scrolled ? "bg-surface/90 shadow-soft border-slate-200" : "bg-surface/60 border-transparent"
      }`}
    >
      <div className="wrap h-[72px] sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-heading font-bold text-ink shrink-0">
          QIVANTA<span className="text-gradient">.</span>
        </Link>

        <nav className="hidden lg:flex gap-5 xl:gap-7" aria-label="Main">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === "/"}
              className={({ isActive }) => `relative py-1 font-medium transition hover:text-brand group ${isActive ? "text-brand" : "text-slate-700"}`}>
              {({ isActive }) => (
                <>
                  {label}
                  <span className={`absolute left-0 -bottom-0.5 h-0.5 rounded bg-gradient-to-r from-brand to-pop transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/contact" className="hidden xl:inline-flex btn-primary !py-2.5">Request a Quote</Link>
          <button className="lg:hidden w-10 h-10 rounded-full border border-slate-200 bg-surface text-ink flex items-center justify-center" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="lg:hidden overflow-hidden bg-surface border-t border-slate-200"
          >
            <div className="wrap py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {links.map(([label, path], i) => (
                <motion.div key={path} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <NavLink to={path} end={path === "/"} className={({ isActive }) => `block py-2.5 px-3 rounded-lg font-medium ${isActive ? "bg-brand/10 text-brand" : "text-slate-700 hover:bg-soft"}`}>{label}</NavLink>
                </motion.div>
              ))}
              <Link to="/contact" className="btn-primary w-full mt-3">Request a Quote</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
