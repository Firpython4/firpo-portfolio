import { type PropsWithChildren } from "react";
import { heptaSlab } from "~/fonts/heptaSlab";
import { inter } from "~/fonts/inter";
import "~/styles/globals.css";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html lang="pt" className={`${inter.variable} ${heptaSlab.variable}`}>
      <body>{props.children}</body>
    </html>
  );
};

export default RootLayout;
