import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";

export default function NotFound() {
  return (
    <section className="wrap py-32 text-center">
      <Seo title="Page not found" />
      <p className="text-7xl sm:text-8xl font-heading font-bold text-gradient inline-block animate-float">404</p>
      <h1 className="text-2xl font-bold mt-4 mb-2">We could not find that page</h1>
      <p className="text-slate-600 mb-8">The link may be broken or the page may have moved.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </section>
  );
}
