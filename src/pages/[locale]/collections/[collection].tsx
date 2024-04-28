import type {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {type GetStaticPaths} from "next";
import Image from "next/image";
import { type ParsedUrlQuery } from "node:querystring";
import {Scaffold} from "~/components/scaffold";
import "@total-typescript/ts-reset";
import {VerticalCenterBox} from "~/components/verticalCenterBox";
import {getAllCollections, getMarkdownFilesForLocales, readCollectionDirectory,} from "../../../cms/fileManagement";
import type {YouTubeConfig} from "react-player/youtube";
import dynamic from "next/dynamic";
import Head from "next/head";
import {Favicon} from "~/components/favicon";
import {type PieceType} from "~/types/pieceType";
import {collectionsPath} from "~/config";
import path from "node:path";
import {getPiecesWithLocale} from "~/index";
import {useRouter} from "next/router";
import { type Locale} from "~/localization/localization";
import {mapMap, mapMapAsync} from "~/functional";
import {type Brand} from "~/typeSafety";
import toContentObject from "../../../contentFormatting";

const ReactPlayerComponent = dynamic(() => import("react-player/youtube"), { ssr: false });

type ContentType = {
    html: string,
    title: string
};

export type LocalizedContentType = Map<Locale, ContentType>;

interface CollectionProps
{
    content: ContentType,
    works: PieceType[]
}

export const getStaticPaths = (async () =>
{
    const directories: string[] = (await getAllCollections())
        .filter((dirent) => dirent.isDirectory())
        .map((directory) => directory.name);
    
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
    return await mapMapAsync(content, toContentObject);
}

async function getPiecesAsProps(collectionId: CollectionId, locale: Locale)
{
    const directoryEntries = await readCollectionDirectory(collectionId);
    const directoriesWithParent = {
        path: path.join(process.cwd(), collectionsPath, collectionId),
        directoryEntities: directoryEntries,
        collectionId: collectionId
    }
    
    return (getPiecesWithLocale(locale))(directoriesWithParent);
}

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    if (context.params && typeof (context.params.collection) === "string")
    {
        const collection = context.params.collection as CollectionId;

        const pieces = await getPiecesAsProps(collection, context.params.locale as Locale);
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
                    }).get(context.params.locale as Locale)!,
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
    const dangerouslySetInnerHTML = {
        __html: props.content.html
    };

    return (
        <>
            <Head>
                <title>Marcelo Firpo - {props.content.title}</title>
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
                        {props.content.title}
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