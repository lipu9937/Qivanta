import { Facebook, Github, Instagram, Linkedin, MessageCircle, Send, Twitter, Youtube, Dribbble } from "lucide-react";

// Social links are now managed in the admin dashboard (Admin -> Social media).
// This file is used for two things only:
//   1. the icon + brand color for each platform name (see socialIcons.js), and
//   2. a fallback list shown if the server cannot be reached.
// To offer a NEW platform in the admin dropdown, add a line here with any lucide-react icon.
export const socials = [
  { name: "WhatsApp",  handle: "+1 234 567 890",     url: "https://wa.me/1234567890",                       icon: MessageCircle, color: "#25D366" },
  { name: "Instagram", handle: "@qivanta",   url: "https://instagram.com/qivanta",          icon: Instagram,     color: "#E4405F" },
  { name: "Facebook",  handle: "QIVANTA",   url: "https://facebook.com/qivanta",           icon: Facebook,      color: "#1877F2" },
  { name: "LinkedIn",  handle: "QIVANTA",   url: "https://linkedin.com/company/qivanta",   icon: Linkedin,      color: "#0A66C2" },
  { name: "X (Twitter)", handle: "@qivanta", url: "https://x.com/qivanta",                  icon: Twitter,       color: "#14171A" },
  { name: "YouTube",   handle: "QIVANTA",   url: "https://youtube.com/@qivanta",           icon: Youtube,       color: "#FF0000" },
  { name: "GitHub",    handle: "qivanta",    url: "https://github.com/qivanta",             icon: Github,        color: "#24292F" },
  { name: "Dribbble",  handle: "qivanta",    url: "https://dribbble.com/qivanta",           icon: Dribbble,      color: "#EA4C89" },
  { name: "Telegram",  handle: "@qivanta",   url: "https://t.me/qivanta",                   icon: Send,          color: "#26A5E4" },
];
