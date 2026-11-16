import { Globe } from "lucide-react";
import { socials as presets } from "./socials";

// NEW: maps a social platform NAME (as chosen in Admin -> Social media) to its icon and brand color.
// To support another platform, add a line to the `socials` list in ./socials.js with a lucide-react icon.
export const socialMeta = Object.fromEntries(presets.map((s) => [s.name, { icon: s.icon, color: s.color }]));

// Names offered in the admin dropdown ("Website" is a generic globe icon for any other link)
export const socialNames = [...presets.map((s) => s.name), "Website"];

// Adds the icon and a color to a social link coming from the API
export const withIcon = (item) => ({
  ...item,
  icon: socialMeta[item.name]?.icon || Globe,
  color: item.color || socialMeta[item.name]?.color || "#525AFF",
});
