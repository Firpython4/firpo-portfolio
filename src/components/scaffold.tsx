import type { PropsWithChildren } from "react";
import { heptaSlab } from "../fonts/heptaSlab";
import { inter } from "../fonts/inter";
import { VerticalCenterBox } from "./verticalCenterBox";

export const Scaffold = (props: PropsWithChildren) => (
  <main
    className={`flex flex-col justify-center overflow-hidden bg-white ${inter.variable} ${heptaSlab.variable}`}
  >
    <VerticalCenterBox>{props.children}</VerticalCenterBox>
  </main>
);
