import { type PropsWithChildren } from "react";
import "~/styles/globals.css"

const RootLayout = (props: PropsWithChildren) =>
{
    return (
        <html lang="pt">
            <body>
                {props.children}
            </body>
        </html>
    )
}

export default RootLayout
