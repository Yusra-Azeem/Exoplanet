/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "system-ui", "sans-serif"],
        mono:    ["'Space Mono'", "monospace"],
      },
      colors: {
        space: {
          950: "#02030a",
          900: "#04061a",
          800: "#0a0d1f",
          700: "#111428",
        },
        indigo: {
          dim: "rgba(99,102,241,0.10)",
          glow: "rgba(99,102,241,0.38)",
        },
        emerald: {
          dim: "rgba(52,211,153,0.10)",
        },
        amber: {
          dim: "rgba(251,191,36,0.10)",
        },
      },
      animation: {
        twinkle:   "twinkle var(--dur, 3s) ease-in-out var(--delay, 0s) infinite alternate",
        shoot:     "shoot var(--sd, 7s) linear var(--sa, 0s) infinite",
        floatA:    "floatA 18s ease-in-out infinite",
        floatB:    "floatB 22s ease-in-out infinite",
        floatC:    "floatC 14s ease-in-out infinite",
        floatD:    "floatD 26s ease-in-out infinite",
        spinCW:    "spin 1.1s linear infinite",
        spinCCW:   "spinCCW 0.75s linear infinite",
        pulse2:    "pulse2 2s ease-in-out infinite",
        atmo:      "atmo 3s ease-in-out infinite alternate",
        nebdrift:  "nebdrift var(--nd, 28s) ease-in-out var(--na, 0s) infinite alternate",
        fadeUp:    "fadeUp 0.45s ease forwards",
        orbit:     "spin 8s linear infinite",
      },
      keyframes: {
        twinkle:  { "0%": { opacity: "var(--lo, 0.1)", transform: "scale(0.8)" }, "100%": { opacity: "var(--hi, 0.5)", transform: "scale(1.3)" } },
        shoot:    { "0%": { opacity: "0", transform: "translate(0,0)" }, "5%": { opacity: "1" }, "75%": { opacity: "0.5" }, "100%": { opacity: "0", transform: "translate(280px,160px)" } },
        floatA:   { "0%,100%": { transform: "translateY(0) translateX(0)" }, "33%": { transform: "translateY(-14px) translateX(7px)" }, "66%": { transform: "translateY(9px) translateX(-9px)" } },
        floatB:   { "0%,100%": { transform: "translateY(0) translateX(0)" }, "40%": { transform: "translateY(18px) translateX(-9px)" }, "70%": { transform: "translateY(-10px) translateX(12px)" } },
        floatC:   { "0%,100%": { transform: "translateY(0) translateX(0)" }, "50%": { transform: "translateY(-13px) translateX(9px)" } },
        floatD:   { "0%,100%": { transform: "translateY(0) translateX(0)" }, "25%": { transform: "translateY(11px) translateX(6px)" }, "75%": { transform: "translateY(-9px) translateX(-7px)" } },
        spinCCW:  { from: { transform: "rotate(360deg)" }, to: { transform: "rotate(0deg)" } },
        pulse2:   { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "1" } },
        atmo:     { from: { opacity: "0.4", transform: "scale(1)" }, to: { opacity: "0.9", transform: "scale(1.06)" } },
        nebdrift: { "0%": { transform: "scale(1) rotate(0deg)", opacity: "0.6" }, "100%": { transform: "scale(1.18) rotate(10deg)", opacity: "1" } },
        fadeUp:   { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      backdropBlur: { xl2: "22px" },
      boxShadow: {
        glass: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        glow:  "0 0 40px rgba(79,70,229,0.55), inset 0 0 20px rgba(99,102,241,0.08)",
      },
    },
  },
  plugins: [],
}
