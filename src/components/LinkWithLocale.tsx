import Link from "next/link";
import { forwardRef, type MutableRefObject, type PropsWithChildren, type Ref } from "react";
import { type Locale } from "~/localization/localization";

type LinkWithLocaleProps = {
    className?: string,
    href: string,
    ref?: MutableRefObject<null>,
    locale: Locale
}

const LinkWithLocale = forwardRef((props: PropsWithChildren<LinkWithLocaleProps>, ref: Ref<HTMLAnchorElement>) =>
{
    return <Link className={props.className} href={`/${props.locale}${props.href}`} ref={ref}>
        {props.children}
    </Link>
})

export default LinkWithLocale;