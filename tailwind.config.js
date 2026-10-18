export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink-900)",
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        brand: "var(--emerald-600)",
      },
      fontFamily: {
        sans: ["Hanken Grotesk Variable", "sans-serif"],
        serif: ["Source Serif 4 Variable", "Georgia", "serif"],
      },
      borderRadius: { card: "var(--r-card)", panel: "var(--r-panel)" },
    },
  },
  plugins: [],
};
