import { type Metadata } from "next";
import ExportedImage from "next-image-export-optimizer";
import {Scaffold} from "~/components/scaffold";
import {VerticalCenterBox} from "~/components/verticalCenterBox";
import type {YouTubeConfig} from "react-player/youtube";
import {type PieceType} from "~/types/pieceType";
import { getCollectionPageContent, getCollectionsStaticPaths } from "~/collection";
import LinkWithLocale from "~/components/LinkWithLocale";
import { PieceVideo } from "~/components/piecePreview";
import { type Locale } from "~/localization/localization";
import { type CollectionPageParams } from "~/types/params";
import commonMetadata from "../../../../metadata";
import { getContainedByAspectRatioStyle } from "../../../../styles/styleUtilities";
import type PropsWithClassName from "../../../../types/propsWithClassName";

export const generateStaticParams = async () =>
{
    return await getCollectionsStaticPaths();
}

type PageParams = CollectionPageParams;
export const generateMetadata = async (props: {params: PageParams}) => {
    const pageContent = await getCollectionPageContent(props.params);
    const metadata: Metadata = {
        ...commonMetadata,
        title: `Marcelo Firpo - ${pageContent.content.title}`,
        description: pageContent.content.asString
    };
    return metadata
}

const Piece = (props: PropsWithClassName<{piece: PieceType<string>}>) =>
{
    const piece = props.piece;
    if (piece.type === "image")
    {
        const style = getContainedByAspectRatioStyle("90vw", "90svh", piece.width, piece.height);

        return (
                <ExportedImage key={piece.url} style={style} className={`${props.className}
                aspect-[${piece.width}/${piece.height}]`} src={piece.url} width={piece.width} height={piece.height} alt={piece.title} sizes={`${piece.width.toString()}px`}/>
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
        
        const style = getContainedByAspectRatioStyle("90vw", "90svh", 16, 9);
        
        return <PieceVideo className={props.className} style={style} playing={false} url={piece.url} youtubeConfig={youTubeConfig} muted={false} controls={true}/>
    }
};

const BackIcon = (props: PropsWithClassName) => <ExportedImage className={props.className} alt="home" src="/icons/back-icon.svg" width={31} height={31} sizes="31px"/>;

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

const Collection = async (props: {params: PageParams}) =>
{
    const pageContent = await getCollectionPageContent(props.params);
    const dangerouslySetInnerHTML = {
        __html: pageContent.content.html
    };

    return (
        <Scaffold>
            <div className="w-responsive-screen
                                      pl-[40px]
                                      sm:pl-[50px]
                                      md:pl-[100px]
                                      lg:pl-[150px]
                                      xl:pl-[411px]
                                      pt-[44px]">
            <BackButton locale={pageContent.locale}/>
        </div>
            <VerticalCenterBox className="gap-y-[16px]
                                          pt-[88px]">
                <h2 className="px-[30px] font-extrabold font-inter text-[17px] text-neutral-700 text-center">
                    {pageContent.content.title}
                </h2>
                <div className="font-inter text-[17px] text-neutral-700 text-center whitespace-pre-wrap"
                     dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
                </div>
            </VerticalCenterBox>
            <VerticalCenterBox className="gap-y-[30px]">
                <VerticalCenterBox className="pt-[74px]
                    sm:pb-[156px]
                    pb-[80px]
                    xl:gap-y-[128px]
                    lg:gap-y-[128px]
                    md:gap-y-[128px]
                    sm:gap-y-[96px]
                    gap-y-[32px]
                    
                    ">
                    {pageContent.pieces.map(piece => <Piece piece={piece} key={piece.url}/>)}
                </VerticalCenterBox>
                <div className="w-responsive-screen
                                              pl-[40px]
                                              sm:pl-[50px]
                                              md:pl-[100px]
                                              lg:pl-[150px]
                                              xl:pl-[411px]
                                              pb-[74px]">
                    <BackButton locale={pageContent.locale}/>
                </div>
            </VerticalCenterBox>
        </Scaffold>
    )
}

export default Collection;