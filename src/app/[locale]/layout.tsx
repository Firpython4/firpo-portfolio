import { type PropsWithChildren } from "react";
import { heptaSlab } from "~/fonts/heptaSlab";
import { inter } from "~/fonts/inter";
import { type Locale } from "~/localization/localization";
import "~/styles/globals.css";

const RootLayout = (
  props: PropsWithChildren<{ params: { locale: Locale } }>,
) => {
  return (
    <html lang={props.params.locale} className={`${inter.variable} ${heptaSlab.variable}`}>
      <body>{props.children}</body>
    </html>
  );
};

export default RootLayout;
