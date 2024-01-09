import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "node:querystring";
import { BottomBar } from "~/components/bottomBar";
import { ExpositionText } from "~/components/expositionText";
import { Favicon } from "~/components/favicon";
import { Hero } from "~/components/hero";
import { PieceCollection } from "~/components/pieceCollection";
import { Scaffold } from "~/components/scaffold";
import { type Locale, locales } from "~/localization/localization";
import { type PieceType } from "~/types/pieceType";
import { getIndexProps } from "../../index";
import { type LocalizedTexts } from "../../localization/texts";

export const getStaticPaths = (() =>
{
    return {
        paths: locales.map(locale => {
            return {
                params: {
                    locale: locale
                }
            }
        }),
        fallback: false
    }
}) satisfies GetStaticPaths

const Home = (props: HomeProps) =>
(
    <>
        <Head>
            <title>Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista</title>
            <Favicon src="/favicon.ico"/>
            <meta name="description" content={props.localizedTexts.homeMetaDescription}/>
        </Head>
        <Scaffold>
            <Hero localizedTexts={props.localizedTexts}/>
            <ExpositionText className="pt-[10px]
                                       mobile_sm:pt-[25px]
                                       mobile_md:pt-[40px]
                                       mobile_lg:pt-[55px]
                                       sm:pt-[70px]
                                       md:pt-[85px]
                                       lg:pt-[100px]
                                       xl:pt-[118px]"
                            locale={props.locale}
                            localizedTexts={props.localizedTexts}/>
            <div className="pt-28">
                <PieceCollection pieces={props.pieces} locale={props.locale}/>
            </div>
            <BottomBar className="pt-20 pb-24" localizedTexts={props.localizedTexts}/>
        </Scaffold>
    </>
);

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    const locale = context.params!.locale as Locale;
    return await getIndexProps(locale);
}) satisfies GetStaticProps<HomeProps>

export type HomeProps = {
    pieces: PieceType<string>[],
    localizedTexts: LocalizedTexts,
    locale: Locale
}
export default Home
