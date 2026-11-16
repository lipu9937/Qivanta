import { MessageCircle } from "lucide-react";
import useSocials from "../../hooks/useSocials";

// NEW: floating chat button (bottom-left). It uses the "WhatsApp" link from Admin -> Social media,
// so change the number there. Delete that social link to hide the button. Remove <WhatsAppButton /> from Layout.jsx to hide it.
export default function WhatsAppButton() {
  const socials = useSocials();
  const wa = socials.find((s) => s.name === "WhatsApp");
  if (!wa) return null;
  return (
    <a
      href={wa.url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full text-white shadow-glow flex items-center justify-center transition hover:-translate-y-1"
      style={{ background: wa.color || "#25D366" }}
    >
      <MessageCircle size={22} />
    </a>
  );
}
