import { Raleway } from "next/font/google";

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway-heading",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});
