import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ptLocale } from "~/localization/localization";
import { Favicon } from "../components/favicon";
import { getIndexProps } from "../index";
import Home, { type HomeProps } from "./[locale]";

const FallbackHome = (props: HomeProps) =>
{
    const router = useRouter();
    useEffect(() => void router.push(`/pt${router.route}`))
    return (
        <>
            <Head>
                <title>Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista</title>
                <Favicon src="/favicon.ico"/>
                <meta name="description" content={props.localizedTexts.homeMetaDescription}/>
            </Head>
            <Home locale={props.locale} pieces={props.pieces} localizedTexts={props.localizedTexts}/>
        </>
    );
};

export const getStaticProps = (async () =>
{
    return await getIndexProps(ptLocale);
}) satisfies GetStaticProps<HomeProps>

export default FallbackHome
