import type {GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {type GetStaticPaths} from "next";
import ExportedImage from "next-image-export-optimizer";
import { type ParsedUrlQuery } from "node:querystring";
import {Scaffold} from "~/components/scaffold";
import "@total-typescript/ts-reset";
import {VerticalCenterBox} from "~/components/verticalCenterBox";
import type {YouTubeConfig} from "react-player/youtube";
import Head from "next/head";
import {Favicon} from "~/components/favicon";
import {type PieceType} from "~/types/pieceType";
import { getCollectionProps, getCollectionsStaticPaths } from "~/collection";
import LinkWithLocale from "~/components/LinkWithLocale";
import { PieceVideo } from "~/components/piecePreview";
import { type ContentType } from "~/types/localizedCollectionType";
import { type Locale } from "../../../localization/localization";

interface CollectionProps
{
    content: ContentType,
    pieces: PieceType<string>[],
    locale: Locale
}
export const getStaticPaths = (async () =>
{
    return await getCollectionsStaticPaths();
}) satisfies GetStaticPaths

const Piece = (props: {piece: PieceType<string>}) =>
{
    const piece = props.piece;
    if (piece.type === "image")
    {
        return (
            <div key={piece.url}>
                <ExportedImage className={`aspect-[${piece.width}/${piece.height}]`} src={piece.url} width={piece.width} height={piece.height} alt={piece.title} sizes={`${piece.width.toString()}px`}/>
            </div>
        );
    }
    else
    {
        const youTubeConfig: YouTubeConfig = {
            playerVars: {
                controls: 1,
                disablekb: 0,
                modestbranding: 1,
                showinfo: 1
            }
        };

        return <PieceVideo playing={false} url={piece.url} youtubeConfig={youTubeConfig}/>
    }
};

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    return await getCollectionProps(context);
}) satisfies GetStaticProps<CollectionProps>

const BackIcon = (props: {className?: string}) => <ExportedImage className={props.className} alt="home" src="/icons/back-icon.svg" width={31} height={31} sizes="31px"/>;

const BackButton = (props: {locale: Locale}) =>
{
    return (
        <div className="w-[31px] aspect-square">
            <LinkWithLocale href="/" locale={props.locale}>
                <BackIcon/>
            </LinkWithLocale>
        </div>
    );
};

const Collection = (props: InferGetStaticPropsType<typeof getStaticProps>) =>
{
    const dangerouslySetInnerHTML = {
        __html: props.content.html
    };

    return (
        <>
            <Head>
                <title>{`Marcelo Firpo - ${props.content.title}`}</title>
                <Favicon src="/favicon.ico"/>
                <meta name="description" content={props.content.asString}/>
            </Head>
            <Scaffold>
                <div className="w-responsive-screen
                                          pl-[40px]
                                          sm:pl-[50px]
                                          md:pl-[100px]
                                          lg:pl-[150px]
                                          xl:pl-[411px]
                                          pt-[44px]">
                <BackButton locale={props.locale}/>
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
                        {props.pieces.map(piece => <Piece piece={piece} key={piece.url}/>)}
                    </VerticalCenterBox>
                    <div className="w-responsive-screen
                                                  pl-[40px]
                                                  sm:pl-[50px]
                                                  md:pl-[100px]
                                                  lg:pl-[150px]
                                                  xl:pl-[411px]
                                                  pb-[74px]">
                        <BackButton locale={props.locale}/>

                    </div>
                </VerticalCenterBox>
            </Scaffold>
        </>
    )
}

export default Collection;