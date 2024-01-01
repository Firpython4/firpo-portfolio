import matter from "gray-matter";
import type { GetStaticProps  } from "next";
import Head from "next/head";
import { type Dirent, promises as fileSystem } from "node:fs";
import { BottomBar } from "~/components/bottomBar";
import { ExpositionText } from "~/components/expositionText";
import { Favicon } from "~/components/favicon";
import { Hero } from "~/components/hero";
import { PieceCollection } from "~/components/pieceCollection";
import { Scaffold } from "~/components/scaffold";
import {type PublicFolder, publicFolderValue} from "~/config";
import {
    absoluteToRelativePath, getFirstMarkdownFile,
    getPath,
    getWorksDirectoryEntities, getSubdirectories,
    isFile,
    isImage, isVideoUrl, getExtension, getVideoUrl
} from "~/cms/fileManagement";
import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";
import { type PieceType } from "~/types/pieceType";
import {includesInner, type StringWithInnerSubstring} from "~/typeSafety";
import path from "node:path";
import {orderByConfig} from "~/cms/ordering";
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
            <ExpositionText className="pt-[118px]"/>
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
