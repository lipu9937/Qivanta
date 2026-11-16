import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import api, { errMsg } from "../../services/api";
import SocialLinks from "../ui/SocialLinks";
import useSettings from "../../hooks/useSettings"; // NEW
import useFetch from "../../hooks/useFetch"; // NEW

const quick = [["About", "/about"], ["Portfolio", "/portfolio"], ["Team", "/team"], ["Blog", "/insights"], ["Contact", "/contact"]];
const defaultSvc = ["Web Development", "Mobile Apps", "UI/UX Design", "Brand Identity"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const settings = useSettings(); // NEW: contact details + footer text from the admin dashboard
  const { data: services } = useFetch("/services"); // NEW: footer service links follow the services you manage in admin
  const svc = services?.length ? services.slice(0, 4).map((s) => [s.title, `/services/${s.slug}`]) : defaultSvc.map((s) => [s, "/services"]);

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/subscribe", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <footer className="relative overflow-hidden bg-night text-night-fg">
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="wrap relative py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-heading font-bold text-white mb-3">QIVANTA<span className="text-gradient">.</span></p>
          <p className="text-sm">{settings.footerText}</p>
          <div className="mt-5"><SocialLinks variant="icons" /></div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick links</h4>
          <ul className="space-y-2 text-sm">
            {quick.map(([l, p]) => <li key={p}><Link to={p} className="hover:text-white transition">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {svc.map(([title, to]) => <li key={to + title}><Link to={to} className="hover:text-white transition">{title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm mb-5">
            {settings.email && <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> <a href={`mailto:${settings.email}`} className="hover:text-white transition break-all">{settings.email}</a></li>}
            {settings.phone && <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white transition">{settings.phone}</a></li>}
            {settings.address && <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {settings.address}</li>}
          </ul>
          <form onSubmit={subscribe} className="flex gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email" aria-label="Email for newsletter"
              className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-night-fg/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand" />
            <button className="bg-gradient-to-r from-brand to-violet hover:shadow-glow transition text-white rounded-lg px-4 text-sm font-semibold">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs">
        © 2026 QIVANTA. All rights reserved.
        <span className="mx-2">·</span><Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        <span className="mx-2">·</span><Link to="/terms" className="hover:text-white transition">Terms</Link>
      </div>
    </footer>
  );
}
