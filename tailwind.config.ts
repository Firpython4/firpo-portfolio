import plugin from "tailwindcss/plugin";
import { type Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontSize: {
        small: "var(--small-font)",
        medium: "var(--medium-font)",
        large: "var(--large-font)",
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        body: ["var(--font-dm-sans)"],
        hepta_slab: ["var(--font-hepta-slab)"],
        inter: ["var(--font-inter)"],
      },
      colors: {
        background: "#F7F5F2",
        surface: "#FFFFFF",
        charcoal: "#1C1C1C",
        "charcoal-muted": "#7A7A7A",
        sienna: "#A0522D",
        "sienna-dark": "#8B4513",
      },
      screens: {
        md: "768px",
        lg: "1024px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animated"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".h-responsive-screen": {
          height: ["100vh /* fallback for Opera, IE and etc. */", "100svh"],
        },
        ".h-responsive-screen-90": {
          height: ["90vh /* fallback for Opera, IE and etc. */", "90svh"],
        },
        ".w-responsive-screen": {
          width: ["100vw /* fallback for Opera, IE and etc. */", "100svw"],
        },
        ".w-responsive-screen-90": {
          width: ["90vw /* fallback for Opera, IE and etc. */", "90svw"],
        },
        ".max-h-responsive-screen": {
          "max-height": [
            "100vh /* fallback for Opera, IE and etc. */",
            "100svh",
          ],
        },
        ".max-h-responsive-screen-90": {
          "max-height": ["90vh /* fallback for Opera, IE and etc. */", "90svh"],
        },
        ".max-w-responsive-screen": {
          "max-width": [
            "100vw /* fallback for Opera, IE and etc. */",
            "100svw",
          ],
        },
        ".max-w-responsive-screen-90": {
          "max-width": ["90vw /* fallback for Opera, IE and etc. */", "90svw"],
        },
      });
    }),
  ],
} satisfies Config;
