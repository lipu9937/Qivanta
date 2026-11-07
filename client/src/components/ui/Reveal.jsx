import { motion } from "framer-motion";

// Fades and slides content in once when it scrolls into view.
// Wrap any block:  <Reveal delay={0.1}>...</Reveal>   (direction: up | down | left | right | none)
const offsets = { up: { y: 28 }, down: { y: -28 }, left: { x: 36 }, right: { x: -36 }, none: {} };

export default function Reveal({ children, delay = 0, direction = "up", className = "", as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
