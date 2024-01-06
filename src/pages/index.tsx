import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectToLocale = () =>
{
    const router = useRouter();
    useEffect(() => void router.push(`/pt-BR${router.route}`))
    return <>Redirecting...</>
}

export default RedirectToLocale;