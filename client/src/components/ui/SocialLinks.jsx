import { ArrowUpRight } from "lucide-react";
import { socials } from "../../config/socials";
import Reveal from "./Reveal";

// variant "cards": icon + name + handle (Contact page)
// variant "icons": round icon buttons (Footer)
export default function SocialLinks({ variant = "cards" }) {
  if (variant === "icons") {
    return (
      <ul className="flex flex-wrap gap-2.5" aria-label="Our social media">
        {socials.map(({ name, url, icon: I, color }) => (
          <li key={name}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name} title={name} style={{ "--c": color }}
              className="w-9 h-9 rounded-full bg-white/10 text-night-fg flex items-center justify-center transition duration-200 hover:text-white hover:bg-[color:var(--c)] hover:-translate-y-0.5">
              <I size={17} />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Follow us everywhere</h2>
      <p className="text-sm text-slate-500 mb-4">Message us or follow our work on any of these platforms.</p>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {socials.map(({ name, handle, url, icon: I, color }, i) => (
          <Reveal as="li" key={name} delay={(i % 4) * 0.05}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name}: ${handle}`} style={{ "--c": color }}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-3 transition duration-200 hover:border-[color:var(--c)] hover:-translate-y-0.5 hover:shadow-soft">
              <span className="w-10 h-10 shrink-0 rounded-lg bg-soft text-ink flex items-center justify-center transition duration-200 group-hover:text-white group-hover:bg-[color:var(--c)]">
                <I size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink leading-tight">{name}</span>
                <span className="block text-xs text-slate-500 truncate">{handle}</span>
              </span>
              <ArrowUpRight size={16} className="text-slate-400 transition group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
