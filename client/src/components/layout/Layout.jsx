import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollProgress, BackToTop } from "../ui/ScrollEffects";

export default function Layout() {
  const { pathname } = useLocation();
  // Braces matter: an effect must not return a value (React treats it as a cleanup function)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <ScrollProgress />
      <Navbar />
      {/* key = pathname, so every page change plays a short fade-in */}
      <motion.main key={pathname} className="pt-20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Outlet />
      </motion.main>
      <Footer />
      <BackToTop />
    </>
  );
}
