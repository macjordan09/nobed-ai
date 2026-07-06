import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Redesign brand system (mission-critical national health platform)
        brand: {
          green: "#0F7A45",
          red: "#D32F2F",
          amber: "#F59E0B",
          ink: "#0F172A",
          mist: "#F8FAFC",
        },
        // Ghana-inspired accents
        ghana: {
          red: "#CE1126",
          gold: "#FCD116",
          green: "#006B3F",
          black: "#000000",
        },
        // Emergency capacity status colours
        status: {
          red: "#DC2626",
          amber: "#EA580C",
          yellow: "#F59E0B",
          green: "#16A34A",
        },
      },
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
