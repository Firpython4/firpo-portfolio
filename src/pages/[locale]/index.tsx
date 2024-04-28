import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "node:querystring";
import { BottomBar } from "~/components/bottomBar";
import { ExpositionText } from "~/components/expositionText";
import { Favicon } from "~/components/favicon";
import { Hero } from "~/components/hero";
import { PieceCollection } from "~/components/pieceCollection";
import { Scaffold } from "~/components/scaffold";
import { type PieceType } from "~/types/pieceType";
import {getIndexProps} from "~/index";
import { type Locale, locales } from "~/localization/localization";

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
            <title>Marcelo Firpo</title>
            <Favicon src="/favicon.ico"/>
        </Head>
        <Scaffold>
            <Hero/>
            <ExpositionText className="pt-[10px]
                                       mobile_sm:pt-[25px]
                                       mobile_md:pt-[40px]
                                       mobile_lg:pt-[55px]
                                       sm:pt-[70px]
                                       md:pt-[85px]
                                       lg:pt-[100px]
                                       xl:pt-[118px]"/>
            <div className="pt-28">
                <PieceCollection pieces={props.pieces} locale={props.locale}/>
            </div>
            <BottomBar className="pt-20 pb-24" locale={props.locale}/>
        </Scaffold>
    </>
);

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    return await getIndexProps(context.params!.locale as Locale);

}) satisfies GetStaticProps<HomeProps>

type HomeProps = {
    pieces: PieceType[],
    locale: Locale
}
export default Home
