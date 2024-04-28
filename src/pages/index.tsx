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
    isFilePredicate,
    isImagePredicate, isUrlPredicate, getExtension, getVideoUrl
} from "~/cms/fileManagement";
import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";
import { type PieceType } from "~/types/pieceType";
import {includesInner, type StringWithInnerSubstring} from "~/typeSafety";
import path from "node:path";
import {orderByConfig} from "~/cms/ordering";

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
    const directoryEntries = await getWorksDirectoryEntities();
    const directories = directoryEntries.filter(dirent => dirent.isDirectory())
    const subDirectories = await Promise.allSettled(getSubdirectories(directories));
    const fulfilledSubdirectories = subDirectories.filter(promiseFullfilledPredicate).map(promise => promise.value);
    const rejectedSubdirectories = subDirectories.filter(promiseRejectedPredicate);
    
    if (rejectedSubdirectories.length > 0)
    {
        throw new Error(`Some subdirectory reads failed: ${rejectedSubdirectories.toString()}`)
    }
    
    const piecePromises = await Promise.allSettled(fulfilledSubdirectories.map(getPieces));
    const promiseRejectedResults = piecePromises.filter(promiseRejectedPredicate);
    if (promiseRejectedResults.length > 0)
    {
        throw new Error(`Some pieces failed to resolve: ${JSON.stringify(promiseRejectedResults)}`)
    }

    const pieces = piecePromises.filter(promiseFullfilledPredicate).map(valueMapper).flat();
    
    await orderByConfig(pieces);

    return {
        props: {
            pieces: pieces
        }
    }
    
}) satisfies GetStaticProps<HomeProps>

type HomeProps = {
    pieces: PieceType[]
}

function replaceNewLineWithNewLineLiterals(collectionTitle: string)
{
    return collectionTitle.replace("\\n", "\n");
}

function getPiece(parentDirectoryPath: StringWithInnerSubstring<PublicFolder>, collectionTitle: string)
{
    return async (mediaDirent: Dirent) =>
    {
        const imageOrUrlPath = getPath(mediaDirent);
        const extension = path.extname(imageOrUrlPath);
        if (includesInner(imageOrUrlPath, "public")) {
            const link: string = absoluteToRelativePath(parentDirectoryPath).replaceAll("\\", "/");
            const shared = {
                linkToCollection: link,
                collectionTitle: replaceNewLineWithNewLineLiterals(collectionTitle),
                title: mediaDirent.name.replace(getExtension(mediaDirent), "")
            };
            if (extension === ".url") {
                return {
                    type: "video" as const,
                    url: await getVideoUrl(imageOrUrlPath),
                    ...shared
                };
            }
            else if (extension === ".png" || extension === ".jpg")
            {
                return {
                    type: "image" as const,
                    url: absoluteToRelativePath(imageOrUrlPath),
                    ...shared
                };
            }
            else
            {
                throw new Error(`Unsupported file format: ${imageOrUrlPath}`)
            }
        }
        else
        {
            throw new Error(`${imageOrUrlPath} is not located in public`);
        }
    };
}

async function getPieces(subCollection: { parent: Dirent, sub: Dirent[] })
{
    const parentDirectoryPath = getPath(subCollection.parent);
    if (includesInner(parentDirectoryPath, publicFolderValue))
    {
        const firstMarkdownFileDirent = getFirstMarkdownFile(subCollection.sub);
        if (firstMarkdownFileDirent)
        {
            const firstMarkdownFile = firstMarkdownFileDirent.name;
            const contentFile = await fileSystem.readFile(getPath(firstMarkdownFileDirent));
            const matterResult = matter(contentFile).data.title as unknown;
            if (typeof(matterResult) === "string")
            {
                const literalNewLine = "\\r\\n";
                const newLineChar = "\n";
                const result = await Promise.allSettled(subCollection.sub.filter(isFilePredicate)
                    .filter(dirent => isImagePredicate(dirent) || isUrlPredicate(dirent))
                    .map(getPiece(parentDirectoryPath, matterResult.replaceAll(literalNewLine, newLineChar))));

                return result.filter(promiseFullfilledPredicate).map(valueMapper);

            }

            throw new Error(`Wrong matter format in ${firstMarkdownFile}`)
        }
        else
        {
            throw new Error(`Unable to find first markdown file at ${subCollection.sub.toString()}`)
        }
    }
    else
    {
        throw new Error(`${parentDirectoryPath} is not located in public`)
    }
}

export default Home
