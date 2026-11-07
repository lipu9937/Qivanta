import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import Icon from "./Icon";
import Reveal from "./Reveal";

export function ServiceCard({ service, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
    <div className="card group p-6 sm:p-8 h-full">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand/15 to-violet/15 text-brand flex items-center justify-center mb-5 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon name={service.icon} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-5">{service.shortDescription}</p>
      <Link to={`/services/${service.slug}`} className="text-brand font-medium inline-flex items-center gap-2">
        Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
    </Reveal>
  );
}

export function ProjectCard({ item, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
    <article className="card group overflow-hidden flex flex-col h-full">
      {item.image ? (
        <div className="h-48 overflow-hidden"><img src={item.image} alt="" loading="lazy" className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-night to-brand flex items-end p-5">
          <span className="text-xs font-semibold bg-pop text-white rounded-full px-3 py-1">{item.category}</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-xs text-slate-500 mb-3">{item.client}</p>
        <p className="text-slate-600 text-sm mb-4">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.techStack?.map((t) => <span key={t} className="text-xs bg-soft rounded-md px-2 py-1">{t}</span>)}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="font-heading font-semibold text-brand text-sm">{item.result}</p>
          {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className="text-slate-500 hover:text-brand"><ArrowUpRight size={18} /></a>}
        </div>
      </div>
    </article>
    </Reveal>
  );
}

export function PostCard({ post, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
    <Link to={`/insights/${post.slug}`} className="card group overflow-hidden flex flex-col h-full">
      {post.coverImage ? (
        <div className="h-44 overflow-hidden"><img src={post.coverImage} alt="" loading="lazy" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-night to-brand flex items-end p-5">
          <span className="text-xs font-semibold bg-brand text-white rounded-full px-3 py-1">{post.category}</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
        <p className="mt-auto text-xs text-slate-500 flex items-center gap-3">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readTime || 3} min read</span>
        </p>
      </div>
    </Link>
    </Reveal>
  );
}
