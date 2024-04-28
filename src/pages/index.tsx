import type { GetStaticProps  } from "next";
import Head from "next/head";
import { BottomBar } from "~/components/bottomBar";
import { ExpositionText } from "~/components/expositionText";
import { Favicon } from "~/components/favicon";
import { Hero } from "~/components/hero";
import { PieceCollection } from "~/components/pieceCollection";
import { Scaffold } from "~/components/scaffold";
import { type PieceType } from "~/types/pieceType";
import {getIndexProps} from "~/index";

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
                <PieceCollection images={props.pieces}/>
            </div>
            <BottomBar className="pt-20 pb-24"/>
        </Scaffold>
    </>
);

export const getStaticProps = (async () =>
{
    return await getIndexProps();

}) satisfies GetStaticProps<HomeProps>

type HomeProps = {
    pieces: PieceType[]
}
export default Home
