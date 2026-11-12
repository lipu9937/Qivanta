// Colors are CSS variables (see src/index.css) so every page switches between light and dark
// automatically. Edit the palette in ONE place: the :root and .dark blocks in index.css.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: v("page"),         // page background
        surface: v("surface"),   // cards, inputs, navbar
        soft: v("soft"),         // alternate section background
        ink: v("ink"),           // headings (dark in light mode, light in dark mode)
        night: "#0A0D1F",        // always-dark areas (footer, page headers)
        "night-fg": "#C9CFE6",   // text on always-dark areas
        brand: { DEFAULT: v("brand"), dark: v("brand-dark") },
        violet: v("violet"),
        pop: v("pop"),
        slate: {
          50: v("slate-50"), 100: v("slate-100"), 200: v("slate-200"), 300: v("slate-300"),
          400: v("slate-400"), 500: v("slate-500"), 600: v("slate-600"), 700: v("slate-700"), 800: v("slate-800"),
        },
      },
      fontFamily: { heading: ["Sora", "sans-serif"], body: ["DM Sans", "sans-serif"] },
      boxShadow: {
        glow: "0 10px 40px -10px rgb(var(--brand) / 0.55)",
        soft: "0 10px 30px -12px rgb(var(--shadow) / 0.25)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.12)" },
          "66%": { transform: "translate(-25px,25px) scale(0.92)" },
        },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "100% 50%" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        blob: "blob 16s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 6s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
