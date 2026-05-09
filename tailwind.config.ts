import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0D0D0D",
        silver: "#B8B8B8",
        denim: "#AFC3D6",
        smoke: "#5A5A5A",
        burgundy: "#4A0F16"
      },
      fontFamily: {
        display: [
          "Old English Text MT",
          "Cloister Black",
          "Bodoni 72 Smallcaps",
          "Didot",
          "Georgia",
          "serif"
        ],
        editorial: ["Didot", "Bodoni 72", "Georgia", "serif"],
        mono: ["Courier New", "Courier", "monospace"]
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "10%": { transform: "translate3d(-2%, -3%, 0)" },
          "20%": { transform: "translate3d(-4%, 2%, 0)" },
          "30%": { transform: "translate3d(3%, -4%, 0)" },
          "40%": { transform: "translate3d(-2%, 5%, 0)" },
          "50%": { transform: "translate3d(-4%, 2%, 0)" },
          "60%": { transform: "translate3d(3%, 0, 0)" },
          "70%": { transform: "translate3d(0, 3%, 0)" },
          "80%": { transform: "translate3d(-3%, 0, 0)" },
          "90%": { transform: "translate3d(2%, 2%, 0)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-140%) rotate(8deg)" },
          "100%": { transform: "translateX(140%) rotate(8deg)" }
        },
        fog: {
          "0%, 100%": { transform: "translate3d(-4%, 2%, 0) scale(1)" },
          "50%": { transform: "translate3d(4%, -2%, 0) scale(1.08)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.34" },
          "50%": { opacity: "0.62" }
        }
      },
      animation: {
        grain: "grain 7s steps(8) infinite",
        shimmer: "shimmer 6.8s ease-in-out infinite",
        fog: "fog 16s ease-in-out infinite",
        pulseGlow: "pulseGlow 5.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
