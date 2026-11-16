import { useState } from "react";
import toast from "react-hot-toast";
import { Link2, Linkedin, Twitter, Facebook } from "lucide-react";

// NEW: share an article on social networks or copy its link
export default function ShareButtons({ title }) {
  const [url] = useState(() => window.location.href);
  const enc = encodeURIComponent;
  const items = [
    ["X (Twitter)", Twitter, `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`],
    ["LinkedIn", Linkedin, `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`],
    ["Facebook", Facebook, `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`],
  ];
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    catch { toast.error("Could not copy the link"); }
  };
  const cls = "w-10 h-10 rounded-full border border-slate-200 bg-surface text-slate-600 hover:text-brand hover:border-brand flex items-center justify-center transition";
  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <span className="text-sm text-slate-500 mr-1">Share</span>
      {items.map(([name, I, href]) => (
        <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={`Share on ${name}`} className={cls}><I size={16} /></a>
      ))}
      <button type="button" onClick={copy} aria-label="Copy link" className={cls}><Link2 size={16} /></button>
    </div>
  );
}
