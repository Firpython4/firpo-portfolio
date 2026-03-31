import { type PropsWithChildren } from "react";
import { LocaleSwitcher } from "~/components/localeSwitcher";
import { playfairDisplay } from "~/fonts/playfairDisplay";
import { dmSans } from "~/fonts/dmSans";
import { heptaSlab } from "~/fonts/heptaSlab";
import { inter } from "~/fonts/inter";
import { type Locale } from "~/localization/localization";
import "~/styles/globals.css";

const RootLayout = (
  props: PropsWithChildren<{ params: { locale: Locale } }>,
) => {
  return (
    <html
      lang={props.params.locale}
      className={`${playfairDisplay.variable} ${dmSans.variable} ${heptaSlab.variable} ${inter.variable}`}
    >
      <body className="relative bg-background text-charcoal antialiased">
        {props.children}
        <LocaleSwitcher
          className="absolute right-[clamp(70px,18vw,180px)] top-4 pt-1 font-body text-base tracking-wide text-white max-[200px]:hidden md:top-6 lg:top-12"
          locale={props.params.locale}
        />
      </body>
    </html>
  );
};

export default RootLayout;
