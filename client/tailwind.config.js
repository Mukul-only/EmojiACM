/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Add Bricolage Grotesque as the default sans-serif font
        sans: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Dark theme color palette - exact from reference
        "brand-dark": "#0D0D0D", // Website background color
        primary: "#ADFF2F", // Primary brand color (lime green)
        stroke: "#38373A", // Stroke color for borders
        "text-primary": "#FFFFFF", // White text
        "text-secondary": "#FFFFFF", // White text for labels
        "border-light": "#FFFFFF", // White borders
        // Legacy colors for compatibility
        "slate-dark": "#111827",
        "slate-medium": "#1F2937",
        "cyan-glow": "#22d3ee",
        "magenta-glow": "#ec4899",
      },
    },
  },
  plugins: [],
};
