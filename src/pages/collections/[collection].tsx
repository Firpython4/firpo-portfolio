import matter from "gray-matter";
import type {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {type GetStaticPaths} from "next";
import Image from "next/image";
import Link from "next/link";
import {type Dirent, promises as fileSystem} from "node:fs";
import {type ParsedUrlQuery} from "node:querystring";
import {remark} from "remark";
import html from "remark-html";
import {Scaffold} from "~/components/scaffold";
import "@total-typescript/ts-reset";
import {VerticalCenterBox} from "~/components/verticalCenterBox";
import {
    getFirstMarkdownFile,
    getPath,
    readCollectionDirectory,
    getAllCollections,
} from "~/cms/fileManagement";
import type {YouTubeConfig} from "react-player/youtube";
import dynamic from "next/dynamic";
import Head from "next/head";
import {Favicon} from "~/components/favicon";
import {type PieceType} from "~/types/pieceType";
import {collectionsPath} from "~/config";
import path from "node:path";
import { getPieces } from "~/index";

const ReactPlayerComponent = dynamic(() => import("react-player/youtube"), { ssr: false });

interface WorkProps
{
    collectionTitle: string,
    content: {
        html: string,
        title: string
    },
    works: PieceType[]
}

export const getStaticPaths = (async () =>
{
    const directories: string[] = (await getAllCollections())
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((directory: Dirent) => directory.name);
    
    return {
        paths: directories.map(directoryName =>
        {
            return {
                params: {
                    collection: directoryName
                }
            };
        }),
        fallback: false
    }
}) satisfies GetStaticPaths

const Piece = (props: {piece: PieceType}) =>
{
    const piece = props.piece;
    if (piece.type === "image")
    {
        return (
            <div key={piece.url}>
                <Image src={piece.url} width={512} height={512} alt={piece.title}/>
            </div>
        );
    }
    else
    {

        const config: YouTubeConfig = {
            playerVars: {
                controls: 1,
                disablekb: 0,
                modestbranding: 1,
                showinfo: 1
            }
        };
        return (
            <ReactPlayerComponent
                url={piece.url}
                controls={true}
                muted={false}
                loop={false}
                config={config}/>
        )
    }
};

async function getContent(collection: string)
{
    const directoryEntries = await readCollectionDirectory(collection);
    const content: Dirent | undefined = getFirstMarkdownFile(directoryEntries)
    if (content)
    {
        const contentFile: Buffer = await fileSystem.readFile(getPath(content));
        const matterResult: matter.GrayMatterFile<Buffer> = matter(contentFile);
        const processedContent = await remark()
            .use(html)
            .process(matterResult.content);

        const title = matterResult.data.title as unknown;
        if (typeof title === "string")
        {
            const literalNewLine = "\\n";
            const newLineChar = "\r\n";
            return {
                title: title.replaceAll(literalNewLine, newLineChar),
                html: processedContent.toString()
            }
        }
    }
}

async function getPiecesAsProps(collection: string)
{
    const directoryEntries = await readCollectionDirectory(collection);
    const directoriesWithParent = {
        path: path.join(process.cwd(), collectionsPath, collection),
        directoryEntities: directoryEntries
    }
    
    return getPieces(directoriesWithParent);
}

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    if (context.params && typeof (context.params.collection) === "string")
    {
        const collection = context.params.collection;

        const pieces = await getPiecesAsProps(collection);
        const content = await getContent(collection);

        if (content)
        {
            const literalNewLine = "\\n";
            const newLineChar = "\r\n";
            return {
                props: {
                    collectionTitle: content.title.replaceAll(literalNewLine, newLineChar),
                    content: content,
                    works: pieces
                }
            }
        }

        throw new Error("Invalid matter");
    }

    throw new Error("Unable to locate markdown file for content");
}) satisfies GetStaticProps<WorkProps>

const BackIcon = (props: {className?: string}) => <Image className={props.className} alt="home" src="/icons/back-icon.svg" width={31} height={31}/>;

const Collection = (props: InferGetStaticPropsType<typeof getStaticProps>) =>
{
    const dangerouslySetInnerHTML = {
        __html: props.content.html
    };

    return (
        <>
            <Head>
                <title>Marcelo Firpo - {props.collectionTitle}</title>
                <Favicon src="/favicon.ico"/>
            </Head>
            <Scaffold>
                <Link href="/" className="w-responsive-screen pl-[411px] pt-[44px]">
                    <BackIcon/>
                </Link>
                <VerticalCenterBox className="gap-y-[16px] pt-[88px]">
                    <h2 className="font-extrabold font-inter text-[17px] text-neutral-700 text-center">
                        {props.collectionTitle}
                    </h2>
                        <div className="font-inter text-[17px] text-neutral-700 text-center whitespace-pre-wrap" dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
                    </div>
                </VerticalCenterBox>
                <VerticalCenterBox className="pt-[74px] pb-[156px] gap-y-[128px]">
                    {props.works.map(work => <Piece piece={work}/>)}
                </VerticalCenterBox>
                <Link href="/" className="w-responsive-screen pl-[411px] pb-[74px]">
                    <BackIcon/>
                </Link>
            </Scaffold>
        </>
    )
}

export default Collection;