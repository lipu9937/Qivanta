import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Elements that make the pointer "react" (ring grows). Add data-cursor="hover" to any element to opt in.
const INTERACTIVE = 'a, button, summary, select, label[for], [role="button"], [data-cursor="hover"]';
// Over text fields the custom cursor hides so the normal text caret shows
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';

// Custom mouse pointer: a dot that sticks to the mouse, a ring that follows with a soft spring,
// and a faint brand-colored glow that trails behind. Colors come from the theme variables, so it
// matches light and dark mode. It is turned off on touch screens and when the visitor prefers
// reduced motion. Position uses motion values, so moving the mouse never re-renders React.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default"); // default | hover | text
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 450, damping: 38, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 450, damping: 38, mass: 0.4 });
  const glowX = useSpring(x, { stiffness: 110, damping: 28, mass: 0.7 });
  const glowY = useSpring(y, { stiffness: 110, damping: 28, mass: 0.7 });

  // Only enable for devices with a real mouse and no reduced-motion preference
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener?.("change", update);
    reduced.addEventListener?.("change", update);
    return () => {
      fine.removeEventListener?.("change", update);
      reduced.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(TEXT_FIELD)) setMode("text");
      else if (t.closest(INTERACTIVE)) setMode("hover");
      else setMode("default");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const show = visible && mode !== "text";
  const spring = { type: "spring", stiffness: 320, damping: 24 };

  return (
    <div aria-hidden="true">
      {/* soft glow that lags behind the mouse */}
      <motion.div style={{ x: glowX, y: glowY }} className="fixed top-0 left-0 z-[98] pointer-events-none">
        <motion.div
          animate={{ opacity: visible ? 1 : 0, scale: mode === "hover" ? 1.25 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-72 h-72 -ml-36 -mt-36 rounded-full"
          style={{ background: "radial-gradient(circle, rgb(var(--brand) / 0.10) 0%, transparent 65%)" }}
        />
      </motion.div>

      {/* ring that follows with a spring */}
      <motion.div style={{ x: ringX, y: ringY }} className="fixed top-0 left-0 z-[100] pointer-events-none">
        <motion.div
          animate={{ scale: pressed ? 0.8 : mode === "hover" ? 1.7 : 1, opacity: show ? 1 : 0 }}
          transition={spring}
          className={`w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border-[1.5px] border-brand/70 transition-colors duration-200 ${
            mode === "hover" ? "bg-brand/10" : "bg-transparent"
          }`}
        />
      </motion.div>

      {/* dot that sticks to the mouse */}
      <motion.div style={{ x, y }} className="fixed top-0 left-0 z-[100] pointer-events-none">
        <motion.div
          animate={{ scale: pressed ? 0.7 : mode === "hover" ? 0.5 : 1, opacity: show ? 1 : 0 }}
          transition={spring}
          className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-brand"
        />
      </motion.div>
    </div>
  );
}
