import { type PropsWithChildren } from "react";
import { LocaleSwitcher } from "~/components/localeSwitcher";
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
      className={`${inter.variable} ${heptaSlab.variable}`}
    >
      <body className="relative">
        {props.children}
        <LocaleSwitcher
          className="iconify-color absolute right-[clamp(70px,18vw,180px)] top-4 text-white max-[200px]:hidden md:top-6 lg:top-12"
          locale={props.params.locale}
        />
      </body>
    </html>
  );
};

export default RootLayout;
