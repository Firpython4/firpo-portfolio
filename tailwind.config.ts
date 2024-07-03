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
        inter: ["var(--font-inter)"],
        hepta_slab: ["var(--font-hepta-slab)"],
      },
      screens: {
        mobile_smallest: "120px",
        mobile_xsm: "200px",
        mobile_sm: "320px",
        mobile_md: "375px",
        mobile_lg: "425px",
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
