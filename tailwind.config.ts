import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontSize: {
        "small": "var(--small-font)",
        "medium": "var(--medium-font)",
        "large": "var(--large-font)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        inter: ["var(--font-inter)"],
        hepta_slab: ["var(--font-hepta-slab)"]
      },
    },
  },
  plugins: [
    plugin(function ({addUtilities}) {
      addUtilities({
                     '.h-responsive-screen': {
                       height: ['100vh /* fallback for Opera, IE and etc. */', '100svh']
                     },
                     '.w-responsive-screen': {
                       width: ['100vw /* fallback for Opera, IE and etc. */', '100svw']
                     }
                   })
    })
  ],
} satisfies Config;
