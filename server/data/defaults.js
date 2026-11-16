// NEW: the starting content for Social media, Tech stack and Site settings.
// It is copied into the database the first time the server runs (see utils/ensureDefaults.js).
// After that, the admin dashboard is the single place to change it.
// The "name" of a social link must be one of the platforms listed in client/src/config/socialIcons.js.
module.exports = {
  socials: [
    { name: "WhatsApp", handle: "+1 234 567 890", url: "https://wa.me/1234567890" },
    { name: "Instagram", handle: "@qivanta", url: "https://instagram.com/qivanta" },
    { name: "Facebook", handle: "QIVANTA", url: "https://facebook.com/qivanta" },
    { name: "LinkedIn", handle: "QIVANTA", url: "https://linkedin.com/company/qivanta" },
    { name: "X (Twitter)", handle: "@qivanta", url: "https://x.com/qivanta" },
    { name: "YouTube", handle: "QIVANTA", url: "https://youtube.com/@qivanta" },
    { name: "GitHub", handle: "qivanta", url: "https://github.com/qivanta" },
    { name: "Dribbble", handle: "qivanta", url: "https://dribbble.com/qivanta" },
    { name: "Telegram", handle: "@qivanta", url: "https://t.me/qivanta" },
  ].map((s, i) => ({ ...s, order: i + 1 })),

  techs: ["React", "Node.js", "MongoDB", "Flutter", "Figma", "Tailwind CSS", "Shopify", "Firebase"]
    .map((name, i) => ({ name, order: i + 1 })),

  settings: {
    email: "hello@qivanta.studio",
    phone: "",
    address: "",
    hours: "We reply within 24 hours",
    footerText: "A freelance team of designers and developers building websites, apps and brands.",
  },
};
