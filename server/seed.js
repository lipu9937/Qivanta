require("dotenv").config();
const mongoose = require("mongoose");
const M = require("./models");

// ---- SAMPLE CONTENT: replace with your own via the admin dashboard (/admin) ----
const svc = (title, slug, category, icon, shortDescription, description, benefits, process, faqs) =>
  ({ title, slug, category, icon, shortDescription, description, benefits, process, faqs });

const services = [
  svc("Web Development", "web-development", "Development", "Code",
    "Fast, responsive websites and web apps built to match your goals.",
    "From marketing sites to full web applications, we build with modern tools and hand over clean, documented code.",
    ["Mobile-first and fast loading", "SEO-ready structure", "Easy to update", "Code you own"],
    [{ step: "Brief", detail: "We agree scope, pages and timeline." }, { step: "Design and build", detail: "Weekly previews you can comment on." }, { step: "Launch", detail: "Testing, deployment and handover." }],
    [{ question: "How long does a website take?", answer: "Most sites take 2 to 4 weeks once content is ready." }, { question: "Do I own the code?", answer: "Yes. Everything is handed over when the final payment is made." }]),
  svc("Mobile App Development", "mobile-apps", "Development", "Smartphone",
    "iOS and Android apps, from first prototype to store release.",
    "We plan, design and build mobile apps with a shared codebase where it makes sense, and help with store submission.",
    ["Android and iOS from one codebase", "Prototype before you commit", "Store submission help"],
    [{ step: "Scope", detail: "Features, screens and priorities." }, { step: "Build", detail: "Two-week milestones with demos." }, { step: "Release", detail: "Testing and store publishing." }],
    [{ question: "Can you start with an MVP?", answer: "Yes. We recommend a small first release to test the idea." }]),
  svc("UI/UX Design", "ui-ux-design", "Design", "Palette",
    "Clear, usable interfaces designed around your customers.",
    "We research, wireframe and design screens in Figma, then test them so developers can build with confidence.",
    ["User flows and wireframes", "Clickable prototypes", "Design system in Figma"],
    [{ step: "Research", detail: "Goals, users and competitors." }, { step: "Wireframe", detail: "Flows and layouts." }, { step: "Polish", detail: "Visual design and handoff files." }],
    [{ question: "Do I get the Figma files?", answer: "Yes, with a tidy component library." }]),
  svc("Brand Identity & Logo", "brand-identity", "Design", "PenTool",
    "Logo, colors, type and guidelines that make you recognisable.",
    "A complete identity kit: logo variations, color palette, typography and a short guide for using them.",
    ["Logo in all file formats", "Color and type system", "Social media kit"],
    [{ step: "Discover", detail: "Values, audience and inspiration." }, { step: "Concepts", detail: "Two directions to choose from." }, { step: "Deliver", detail: "Final files and brand guide." }],
    [{ question: "How many revisions are included?", answer: "Two rounds of revisions are included in every package." }]),
  svc("E-commerce Stores", "ecommerce", "Development", "ShoppingCart",
    "Online stores with secure checkout and easy product management.",
    "We set up and customise your store, connect payments and shipping, and train you to manage it.",
    ["Secure payments", "Inventory and order management", "Training for your team"],
    [{ step: "Plan", detail: "Catalog, payments and shipping." }, { step: "Build", detail: "Theme, products and checkout." }, { step: "Launch", detail: "Testing and go-live support." }],
    [{ question: "Which platforms do you use?", answer: "We recommend the platform that fits your size, including custom builds." }]),
  svc("Maintenance & Support", "maintenance-support", "Development", "LifeBuoy",
    "Updates, fixes and improvements after launch.",
    "A monthly plan covering updates, backups, small changes and a quick response when something breaks.",
    ["Regular updates and backups", "Priority bug fixes", "Monthly small changes"],
    [{ step: "Onboard", detail: "Access and a health check." }, { step: "Maintain", detail: "Monthly updates and monitoring." }, { step: "Report", detail: "A short summary every month." }],
    [{ question: "Can I cancel anytime?", answer: "Yes, with 30 days' notice." }]),
];

const projects = [
  { title: "Restaurant ordering app", client: "Sample client", category: "Mobile", featured: true, description: "Menu browsing, table ordering and kitchen display for a restaurant group.", result: "Orders up 35%", techStack: ["React Native", "Node.js", "MongoDB"] },
  { title: "Portfolio site for a photographer", client: "Sample client", category: "Web", featured: true, description: "Fast gallery site with a booking form and an easy admin for new work.", result: "Bookings doubled", techStack: ["React", "Tailwind", "Express"] },
  { title: "Brand refresh for a coffee roaster", client: "Sample client", category: "Branding", featured: true, description: "New logo, packaging palette and a social media kit.", result: "Launched in 3 weeks", techStack: ["Figma", "Illustrator"] },
];

const team = [
  { name: "Your Name", role: "Full-stack Developer", bio: "Replace this with a short bio. Mention what you build and what you enjoy.", skills: ["React", "Node.js", "MongoDB"], order: 1 },
  { name: "Teammate 2", role: "UI/UX Designer", bio: "Replace this with your designer's bio.", skills: ["Figma", "Prototyping", "Design systems"], order: 2 },
  { name: "Teammate 3", role: "Mobile Developer", bio: "Replace this with your mobile developer's bio.", skills: ["Flutter", "React Native", "Firebase"], order: 3 },
  { name: "Teammate 4", role: "Brand Designer", bio: "Replace this with your brand designer's bio.", skills: ["Logo design", "Illustration", "Typography"], order: 4 },
];

const text = "A good project starts with a clear brief. Write down who the site or app is for and what one action you want them to take.\n\nThen list the pages or screens you need, and agree a budget and deadline before design begins.\n\nShort feedback rounds beat long ones: review early, review often.";
const posts = [
  { title: "What to include in a website brief", slug: "website-brief-checklist", category: "Web", author: "QIVANTA Team", excerpt: "A simple checklist that saves weeks of back and forth.", content: text, readTime: 2, published: true },
  { title: "Logo vs brand identity: what do you need?", slug: "logo-vs-brand-identity", category: "Design", author: "QIVANTA Team", excerpt: "How to decide what to spend on when you are starting out.", content: text, readTime: 2, published: true },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all(["Service", "Post", "Project", "Testimonial", "TeamMember"].map((m) => M[m].deleteMany()));
  await M.Service.insertMany(services);
  await M.Project.insertMany(projects);
  await M.TeamMember.insertMany(team);
  await M.Post.insertMany(posts);

  const email = (process.env.ADMIN_EMAIL || "admin@qivanta.studio").toLowerCase();
  await M.User.deleteOne({ email });
  await M.User.create({ name: "Admin", email, password: process.env.ADMIN_PASSWORD || "Admin@12345" });
  console.log(`Seeded. Admin login: ${email} / ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
