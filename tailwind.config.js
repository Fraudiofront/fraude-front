/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#17478e",      // Azul Corporativo
          lightBlue: "#00adef", // Celeste / Acento
          navy: "#081f3f",      // Azul Marino Oscuro / Premium Contraste
          white: "#ffffff",     // Blanco Puro
        },
        risk: {
          low: "#10b981",    // Emerald-500
          medium: "#f59e0b", // Amber-500
          high: "#ef4444",   // Rose-500
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(8, 31, 63, 0.05), 0 2px 8px -1px rgba(8, 31, 63, 0.03)",
        glow: "0 0 15px 0 rgba(0, 173, 239, 0.15)",
      },
    },
  },
  plugins: [],
}
