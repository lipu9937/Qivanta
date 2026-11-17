import useFetch from "./useFetch";

// NEW: contact details and footer text (admin -> Site settings)
const fallback = {
  email: "workwithqivanta@gmail.com",
  phone: "",
  address: "",
  hours: "We reply within 24 hours",
  footerText: "A freelance team of designers and developers building websites, apps and brands.",
};
const empty = { email: "workwithqivanta@gmail.com", phone: "", address: "", hours: "", footerText: "" };

export default function useSettings() {
  const { data, loading, error } = useFetch("/settings");
  if (loading) return empty;
  return error || !data || Array.isArray(data) || typeof data !== "object" ? fallback : { ...empty, ...data };
}
