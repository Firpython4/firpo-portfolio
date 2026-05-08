import { type PropsWithChildren } from "react";
import { inter } from "~/fonts/inter";
import "~/styles/globals.css";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html
      lang="pt"
      className={`${inter.variable}`}
    >
      <body className="relative bg-background text-charcoal antialiased">
        {props.children}
      </body>
    </html>
  );
};

export default RootLayout;
