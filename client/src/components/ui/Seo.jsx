import { Helmet } from "react-helmet-async";

export default function Seo({ title, description }) {
  const full = title ? `${title} | QIVANTA` : "QIVANTA - Strategy that moves you forward";
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}
