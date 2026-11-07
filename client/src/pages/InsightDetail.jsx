import { Link, useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import Seo from "../components/ui/Seo";
import useFetch from "../hooks/useFetch";

export default function InsightDetail() {
  const { slug } = useParams();
  const { data: p, loading, error } = useFetch(`/posts/${slug}`);

  if (loading) return <Loader />;
  if (error || !p) return <div className="wrap py-24 text-center"><p className="mb-4">{error || "Article not found."}</p><Link to="/insights" className="btn-outline">All insights</Link></div>;

  return (
    <article className="wrap max-w-3xl py-16">
      <Seo title={p.title} description={p.excerpt} />
      <Link to="/insights" className="text-brand text-sm">Back to insights</Link>
      <p className="mt-6 text-sm text-brand font-semibold">{p.category}</p>
      <h1 className="text-4xl font-bold mt-2 mb-4">{p.title}</h1>
      <p className="text-sm text-slate-500 mb-10">{p.author} · {new Date(p.createdAt).toLocaleDateString()} · {p.readTime || 3} min read</p>
      {p.coverImage && <img src={p.coverImage} alt="" className="rounded-xl mb-10 w-full" />}
      {/* Content is rendered as plain text paragraphs (no raw HTML), which keeps it safe from XSS */}
      <div className="space-y-5 text-lg text-slate-700">
        {(p.content || "").split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </article>
  );
}
