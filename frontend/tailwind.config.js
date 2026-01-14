/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#40B59D",
        "background-light": "#f6f8f7",
        "background-dark": "#12201d",
        "foreground-light": "#1f2937",
        "foreground-dark": "#f9fafb",
        "muted-light": "#6b7280",
        "muted-dark": "#9ca3af",
        "text-light": "#111827",
        "text-dark": "#f3f4f6",
        "subtle-light": "#e5e7eb",
        "subtle-dark": "#374151",
        "placeholder-light": "#9ca3af",
        "placeholder-dark": "#6b7280",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
