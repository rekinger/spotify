import { nextui } from "@nextui-org/theme";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(button|input|popover|scroll-shadow|skeleton|tabs|ripple|spinner).js",
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
