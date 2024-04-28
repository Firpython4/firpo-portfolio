import matter from "gray-matter";
import type {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {type GetStaticPaths} from "next";
import Image from "next/image";
import {type Dirent, promises as fileSystem} from "node:fs";
import {type ParsedUrlQuery} from "node:querystring";
import {remark} from "remark";
import html from "remark-html";
import {Scaffold} from "~/components/scaffold";
import "@total-typescript/ts-reset";
import {VerticalCenterBox} from "~/components/verticalCenterBox";
import {getAllCollections, getMarkdownFilesForLocales, getPath, readCollectionDirectory,} from "~/cms/fileManagement";
import type {YouTubeConfig} from "react-player/youtube";
import dynamic from "next/dynamic";
import Head from "next/head";
import {Favicon} from "~/components/favicon";
import {type PieceType} from "~/types/pieceType";
import {collectionsPath} from "~/config";
import path from "node:path";
import {getPieces} from "~/index";
import {useRouter} from "next/router";
import {getLocalizedContent, type Locale} from "~/localization/localization";
import {mapMap, mapMapAsync} from "~/functional";
import {type Brand} from "~/typeSafety";

const ReactPlayerComponent = dynamic(() => import("react-player/youtube"), { ssr: false });

type ContentType = {
    html: string,
    title: string
};

export type LocalizedContentType = Map<Locale, ContentType>;

interface CollectionProps
{
    content: LocalizedContentType,
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

export type CollectionId = Brand<string, "collectionId">;

export async function getContent(collectionId: CollectionId)
{
    const directoryEntries = await readCollectionDirectory(collectionId);
    const content = getMarkdownFilesForLocales(directoryEntries)
    return await mapMapAsync(content, async (locale, content) =>
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
            const contentObject = {
                title: title.replaceAll(literalNewLine, newLineChar),
                html: processedContent.toString()
            };
            return [locale, contentObject];
        }
        else
        {
            throw new Error("Title is malformed")
        }
    });
}

async function getPiecesAsProps(collectionId: CollectionId)
{
    const directoryEntries = await readCollectionDirectory(collectionId);
    const directoriesWithParent = {
        path: path.join(process.cwd(), collectionsPath, collectionId),
        directoryEntities: directoryEntries,
        collectionId: collectionId
    }
    
    return getPieces(directoriesWithParent);
}

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    if (context.params && typeof (context.params.collection) === "string")
    {
        const collection = context.params.collection as CollectionId;

        const pieces = await getPiecesAsProps(collection);
        const content = await getContent(collection);

        if (content)
        {
            const literalNewLine = "\\n";
            const newLineChar = "\r\n";
            return {
                props: {
                    content: mapMap(content, (locale, contentObject) =>
                    {
                        const titleWithNewLines = contentObject.title.replaceAll(literalNewLine, newLineChar);
                        return [locale, {
                            html: contentObject.html,
                            title: titleWithNewLines
                        }];
                    }),
                    works: pieces
                }
            }
        }

        throw new Error("Invalid matter");
    }

    throw new Error("Unable to locate markdown file for content");
}) satisfies GetStaticProps<CollectionProps>

const BackIcon = (props: {className?: string}) => <Image className={props.className} alt="home" src="/icons/back-icon.svg" width={31} height={31}/>;

function BackButton()
{
    const router = useRouter();
    return <div onClick={router.back}>
        <BackIcon/>
    </div>;
}

const Collection = (props: InferGetStaticPropsType<typeof getStaticProps>) =>
{
    const localizedContent = getLocalizedContent(props.content);
    const dangerouslySetInnerHTML = {
        __html: localizedContent.html
    };

    return (
        <>
            <Head>
                <title>Marcelo Firpo - {props.content}</title>
                <Favicon src="/favicon.ico"/>
            </Head>
            <Scaffold>
            <div className="w-responsive-screen
                                          pl-[40px]
                                          sm:pl-[50px]
                                          md:pl-[100px]
                                          lg:pl-[150px]
                                          xl:pl-[411px]
                                          pt-[44px]">
                <BackButton/>
            </div>
                <VerticalCenterBox className="gap-y-[16px]
                                              pt-[88px]">
                    <h2 className="px-[30px] font-extrabold font-inter text-[17px] text-neutral-700 text-center">
                        {props.content}
                    </h2>
                    <div className="font-inter text-[17px] text-neutral-700 text-center whitespace-pre-wrap"
                         dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
                    </div>
                </VerticalCenterBox>
                <VerticalCenterBox className="gap-y-[30px]">
                    <VerticalCenterBox className="pt-[74px] pb-[156px] gap-y-[128px]">
                        {props.works.map(work => <Piece piece={work}/>)}
                    </VerticalCenterBox>
                    <div className="w-responsive-screen
                                                  pl-[40px]
                                                  sm:pl-[50px]
                                                  md:pl-[100px]
                                                  lg:pl-[150px]
                                                  xl:pl-[411px]
                                                  pb-[74px]">
                        <BackButton/>

                    </div>
                </VerticalCenterBox>
            </Scaffold>
        </>
    )
}

export default Collection;