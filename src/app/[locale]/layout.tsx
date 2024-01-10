import { type PropsWithChildren } from "react";
import { type Locale } from "~/localization/localization";
import "~/styles/globals.css"

const RootLayout = (props: PropsWithChildren<{params: {locale: Locale}}>) =>
{
    return (
        <html lang={props.params.locale}>
            <body>
                {props.children}
            </body>
        </html>
    )
}

export default RootLayout
