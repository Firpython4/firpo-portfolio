// /hooks/tailwind.ts

import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../tailwind.config";
import create from "./tailwind-breakpoints/use-tailwind-breakpoint";

const config = resolveConfig(tailwindConfig);

export const { useBreakpoint } = create(config.theme);
