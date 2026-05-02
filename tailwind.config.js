/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      colors: {
        mate: {
          bg: "#04070D",
          deep: "#05070C",
          surface: "#0B0D12",
          panel: "#111418",
          panel2: "#181A1F",
          text: "#E7EBF2",
          muted: "rgba(231,235,242,0.62)",
          line: "rgba(223,226,234,0.08)",
          lineStrong: "rgba(223,226,234,0.16)",
          mist: "rgba(61,92,124,0.16)",
          glow: "rgba(191,230,255,0.16)",
          violet: "rgba(120,109,255,0.12)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        premium: "0 28px 64px rgba(0,0,0,0.28)",
        card: "0 36px 90px rgba(0,0,0,0.48)",
        deep: "0 50px 120px rgba(0,0,0,0.60)",
        glow: "0 0 24px rgba(191,230,255,0.10)",
        halo: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 80px rgba(0,0,0,0.42), 0 0 28px rgba(191,230,255,0.08)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.06), transparent 18%), radial-gradient(circle at 65% 16%, rgba(191,230,255,0.14), transparent 20%), radial-gradient(circle at 80% 34%, rgba(61,92,124,0.18), transparent 18%), radial-gradient(circle at 50% 90%, rgba(120,109,255,0.12), transparent 24%)",
        "panel-sheen":
          "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 28%)",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,18px,0) scale(1.04)" },
        },
        orbit: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,20px,0)" },
        },
        gridDrift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(18px,-10px,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.48", transform: "scale(1)" },
          "50%": { opacity: "0.78", transform: "scale(1.06)" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",
        orbit: "orbit 18s ease-in-out infinite",
        "grid-drift": "gridDrift 15s linear infinite",
        "float-slow": "floatSlow 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
