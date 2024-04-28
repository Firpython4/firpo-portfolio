import Link from "next/link";
import { type MutableRefObject, type PropsWithChildren } from "react";
import { type Locale } from "~/localization/localization";

type LinkWithLocaleProps = {
    className?: string,
    href: string,
    ref?: MutableRefObject<null>,
    locale: Locale
}

const LinkWithLocale = (props: PropsWithChildren<LinkWithLocaleProps>) =>
{
    return <Link className={props.className} href={`/${props.locale}${props.href}`}>
        {props.children}
    </Link>
}

export default LinkWithLocale;