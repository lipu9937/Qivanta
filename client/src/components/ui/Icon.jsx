import { Code, Smartphone, Palette, PenTool, ShoppingCart, LifeBuoy } from "lucide-react";

// Services store one of these names in their "icon" field
const icons = { Code, Smartphone, Palette, PenTool, ShoppingCart, LifeBuoy };

export default function Icon({ name, size = 26 }) {
  const C = icons[name] || Code;
  return <C size={size} />;
}
