import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { type PieceType } from "~/types/pieceType";
import {getIndexProps} from "~/index";
import { type Locale, ptLocale, useLocaleTexts } from "~/localization/localization";
import { Favicon } from "../components/favicon";
import Home from "./[locale]";

const FallbackHome = (props: HomeProps) =>
{
    const router = useRouter();
    useEffect(() => void router.push(`/pt${router.route}`))
    return (
        <>
            <Head>
                <title>Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista</title>
                <Favicon src="/favicon.ico"/>
                <meta name="description" content={useLocaleTexts(props.locale).homeMetaDescription}/>
            </Head>
            <Home locale={props.locale} pieces={props.pieces}/>
        </>
    );
};

export const getStaticProps = (async () =>
{
    return await getIndexProps(ptLocale);
    
}) satisfies GetStaticProps<HomeProps>

type HomeProps = {
    pieces: PieceType[],
    locale: Locale
}
export default FallbackHome
