import Reveal from "./Reveal";

export default function SectionTitle({ title, subtitle, center = true }) {
  return (
    <Reveal className={`mb-10 md:mb-14 ${center ? "text-center mx-auto" : ""} max-w-2xl`}>
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      <div className={`mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-brand to-pop ${center ? "mx-auto" : ""}`} />
      {subtitle && <p className="mt-4 text-slate-500 text-base md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
