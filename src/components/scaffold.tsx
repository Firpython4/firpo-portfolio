import type { PropsWithChildren } from "react";
import { heptaSlab } from "../fonts/heptaSlab";
import { inter } from "../fonts/inter";

export const Scaffold = (props: PropsWithChildren) => (
    <main className={`bg-white flex flex-col justify-center overflow-hidden ${inter.variable} ${heptaSlab.variable}`}>
        {props.children}
    </main>
);