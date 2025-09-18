/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: "#15203e",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#15203e", // Your primary color
          950: "#0f172a",
        },
        accent: {
          DEFAULT: "#be185d",
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d", // Your accent color
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },

        // Background colors
        bg: {
          light: "#FFFFFF",
          dark: "#F3F4F6",
        },

        // Text colors
        text: {
          dark: "#1F2937",
          gray: "#6B7280",
          light: "#FFFFFF",
          placeholder: "#9CA3AF",
        },

        // Border colors
        border: {
          light: "#E5E7EB",
          subtle: "#D1D5DB",
        },

        // Other semantic colors
        link: "#3B82F6",
        destructive: {
          DEFAULT: "#EF4444",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Your destructive color
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
    },
  },
  plugins: [],
};
