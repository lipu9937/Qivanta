import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import api, { errMsg } from "../../services/api";
import SocialLinks from "../ui/SocialLinks";

const quick = [["About", "/about"], ["Portfolio", "/portfolio"], ["Team", "/team"], ["Blog", "/insights"], ["Contact", "/contact"]];
const svc = ["Web Development", "Mobile Apps", "UI/UX Design", "Brand Identity"];

export default function Footer() {
  const [email, setEmail] = useState("");

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
    <footer className="bg-night text-night-fg">
      <div className="wrap py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-heading font-bold text-white mb-3">QIVANTA<span className="text-gradient">.</span></p>
          <p className="text-sm">A freelance team of designers and developers building websites, apps and brands.</p>
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
            {svc.map((s) => <li key={s}><Link to="/services" className="hover:text-white transition">{s}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm mb-5">
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> hello@qivanta.studio</li>
          </ul>
          <form onSubmit={subscribe} className="flex gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email" aria-label="Email for newsletter"
              className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-night-fg/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand" />
            <button className="bg-gradient-to-r from-brand to-violet hover:shadow-glow transition text-white rounded-lg px-4 text-sm font-semibold">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 QIVANTA. All rights reserved.
      </div>
    </footer>
  );
}
