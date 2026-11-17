import useFetch from "./useFetch";
import { socials as fallback } from "../config/socials";
import { withIcon } from "../config/socialIcons";

// NEW: social links from the database (admin-managed). Shows the built-in list only if the server is unreachable.
export default function useSocials() {
  const { data, loading, error } = useFetch("/socials");
  if (loading) return [];
  if (error || !Array.isArray(data)) return fallback; // NEW: never crash on an unexpected answer
  return data.map(withIcon);
}
