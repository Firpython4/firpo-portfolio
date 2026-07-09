import { type PropsWithChildren } from "react";
import { raleway, ralewayHeading } from "~/fonts/raleway";
import "~/styles/globals.css";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html
      lang="pt"
      className={`${raleway.variable} ${ralewayHeading.variable}`}
    >
      <body className="relative bg-dawn text-ink antialiased">
        {props.children}
      </body>
    </html>
  );
};

export default RootLayout;
