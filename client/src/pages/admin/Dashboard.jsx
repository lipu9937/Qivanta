import ThemeToggle from "../../components/ui/ThemeToggle";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Inbox, FileText, LogOut, FolderKanban, Wrench, Users, Quote } from "lucide-react";
import Seo from "../../components/ui/Seo";
import Loader from "../../components/ui/Loader";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import Leads from "./Leads";
import Posts from "./Posts";
import ResourceManager from "./ResourceManager";

function Overview() {
  const { data, loading } = useFetch("/stats");
  if (loading) return <Loader />;
  const cards = [["Quote requests", data?.totalLeads], ["New this week", data?.newThisWeek], ["Awaiting reply", data?.newLeads], ["Projects", data?.projects], ["Published posts", data?.publishedPosts], ["Subscribers", data?.subscribers]];
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(([l, v]) => (
        <div key={l} className="bg-surface rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">{l}</p>
          <p className="text-4xl font-heading font-bold text-ink mt-1">{v ?? 0}</p>
        </div>
      ))}
    </div>
  );
}

const categories = ["Web", "Mobile", "Design", "Branding"];

const screens = {
  overview: ["Overview", LayoutDashboard, () => <Overview />],
  leads: ["Quote requests", Inbox, () => <Leads />],
  projects: ["Projects", FolderKanban, () => (
    <ResourceManager endpoint="/projects" noun="project" titleOf={(p) => p.title} subOf={(p) => `${p.category || ""} ${p.featured ? "· featured" : ""}`}
      fields={[
        { name: "title", label: "Project title", required: true }, { name: "client", label: "Client" },
        { name: "category", label: "Category", type: "select", options: categories },
        { name: "description", label: "Description", type: "textarea" }, { name: "result", label: "Result (e.g. Orders up 35%)" },
        { name: "techStack", label: "Tools used", type: "list" }, { name: "liveUrl", label: "Live URL (https://...)" },
        { name: "image", label: "Image URL" }, { name: "featured", label: "Show first on the site", type: "checkbox" },
      ]} />
  )],
  services: ["Services", Wrench, () => (
    <ResourceManager endpoint="/services" noun="service" titleOf={(s) => s.title} subOf={(s) => s.category}
      fields={[
        { name: "title", label: "Service name", required: true }, { name: "category", label: "Category", type: "select", options: ["Development", "Design"] },
        { name: "icon", label: "Icon", type: "select", options: ["Code", "Smartphone", "Palette", "PenTool", "ShoppingCart", "LifeBuoy"] },
        { name: "shortDescription", label: "One-line summary" }, { name: "description", label: "Full description", type: "textarea" },
        { name: "benefits", label: "Benefits", type: "list" },
      ]} />
  )],
  team: ["Team", Users, () => (
    <ResourceManager endpoint="/team" noun="member" titleOf={(m) => m.name} subOf={(m) => m.role}
      fields={[
        { name: "name", label: "Name", required: true }, { name: "role", label: "Role" }, { name: "bio", label: "Short bio", type: "textarea" },
        { name: "skills", label: "Skills", type: "list" }, { name: "photo", label: "Photo URL" },
        { name: "linkedin", label: "LinkedIn URL" }, { name: "portfolio", label: "Portfolio URL" }, { name: "order", label: "Order (1 shows first)", type: "number" },
      ]} />
  )],
  testimonials: ["Testimonials", Quote, () => (
    <ResourceManager endpoint="/testimonials" noun="testimonial" titleOf={(t) => t.name || "Anonymous"} subOf={(t) => t.company}
      fields={[
        { name: "name", label: "Client name" }, { name: "role", label: "Role" }, { name: "company", label: "Company" },
        { name: "quote", label: "Quote", type: "textarea", required: true }, { name: "rating", label: "Rating (1-5)", type: "number" },
      ]} />
  )],
  posts: ["Blog posts", FileText, () => <Posts />],
};

export default function Dashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [label, , render] = screens[tab];

  return (
    <div className="min-h-screen bg-soft md:flex">
      <Seo title="Admin" />
      <aside className="bg-night text-night-fg md:w-60 p-5 md:min-h-screen flex md:block gap-2 overflow-x-auto">
        <Link to="/" className="hidden md:block text-2xl font-heading font-bold text-white mb-8">QIVANTA<span className="text-pop">.</span></Link>
        {Object.entries(screens).map(([k, [name, I]]) => (
          <button key={k} onClick={() => setTab(k)} aria-current={tab === k}
            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg mb-1 whitespace-nowrap ${tab === k ? "bg-brand text-white" : "hover:bg-white/10"}`}>
            <I size={18} /> {name}
          </button>
        ))}
        <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/10 md:mt-8 whitespace-nowrap">
          <LogOut size={18} /> Log out
        </button>
        <ThemeToggle className="shrink-0 md:mt-4 !bg-white/10 !text-white !border-white/10" />
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">{label}</h1>
        {/* key resets form state when switching screens */}
        <div key={tab}>{render()}</div>
      </main>
    </div>
  );
}
