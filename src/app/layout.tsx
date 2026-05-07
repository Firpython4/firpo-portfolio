import { type PropsWithChildren } from "react";
import { playfairDisplay } from "~/fonts/playfairDisplay";
import { dmSans } from "~/fonts/dmSans";
import { heptaSlab } from "~/fonts/heptaSlab";
import { inter } from "~/fonts/inter";
import "~/styles/globals.css";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html
      lang="pt"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${heptaSlab.variable} ${inter.variable}`}
    >
      <body className="relative bg-background text-charcoal antialiased">
        {props.children}
      </body>
    </html>
  );
};

export default RootLayout;
