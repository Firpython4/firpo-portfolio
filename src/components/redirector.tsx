"use client"

import { useRouter } from "next/router";
import { useEffect } from "react";

const Redirector = () =>
{
    const router = useRouter();
    useEffect(() => void router.push(`/pt${router.route}`))
    return <></>
}

export default Redirector;