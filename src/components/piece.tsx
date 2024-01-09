import dynamic from "next/dynamic";
import Image from "next/image";

import { useRef } from "react";
import { type YouTubeConfig } from "react-player/youtube";
import { useHover } from "usehooks-ts";
import { type PieceType } from "~/types/pieceType";
import { type Locale } from "~/localization/localization";
import LinkWithLocale from "./LinkWithLocale";

const YoutubeReactPlayerComponent = dynamic(() => import("react-player/youtube"), {ssr: false});
const VimeoReactPlayerComponent = dynamic(() => import("react-player/vimeo"), {ssr: false});

export const Piece = (props: { piece: PieceType<string>, locale: Locale }) =>
{
    const piece = props.piece;
    const ref = useRef(null);
    const isHovering = useHover(ref);
    return (
        <LinkWithLocale
            className="relative max-w-[364px] max-h-[205px] group overflow-hidden flex items-center"
            href={piece.linkToCollection} ref={ref} locale={props.locale}>
            <div className="opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            ease-in
                            duration-100
                            bg-black/40 w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            absolute
                            font-inter
                            font-medium
                            text-white
                            text-center
                            text-[24px]
                            whitespace-pre-wrap">
                {piece.collectionName}
            </div>
            <PieceThumbnail piece={piece} shouldPlay={isHovering}/>
        </LinkWithLocale>
    );
};

const PreviewVideo = (props: {
    url: string,
    playing: boolean,
    className?: string
}) =>
{
    if (props.url.includes("youtube"))
    {
        const config: YouTubeConfig = {
            playerVars: {
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                showinfo: 0
            }
        };
        return <YoutubeReactPlayerComponent
            width={364}
            height={205}
            url={props.url}
            controls={false}
            muted={true}
            loop={true}
            playing={props.playing}
            config={config}/>;
    }
    else if (props.url.includes("vimeo"))
    {
        return <VimeoReactPlayerComponent
            width={364}
            height={205}
            url={props.url}
            controls={false}
            muted={true}
            loop={true}
            playing={props.playing}/>;
    }

    throw new Error(`Unsupported video provider: ${props.url}`)
}

const maxresdefault = "maxresdefault" as const;
const sddefault = "sddefault" as const;
const mqdefault = "mqdefault";
const hqdefault = "hqdefault";

const qualityTypes = [maxresdefault, sddefault, mqdefault, hqdefault];

type QualityType = typeof qualityTypes[number];

function getThumbnail(url: string, quality?: string)
{
    if (url)
    {
        let video_id = undefined;
        let result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/);
        if (result)
        {
            video_id = result.pop();
        }
        else
        {
            result = url.match(/youtu.be\/(.{11})/);
            if (result)
            {
                video_id = result.pop();
            }
        }
        
        if (video_id)
        {
            if (quality === undefined)
            {
                quality = "high";
            }
            
            let quality_key: QualityType = "maxresdefault"
            if (quality == "low")
            {
                quality_key = sddefault;
            }
            else if (quality == "medium")
            {
                quality_key = mqdefault;
            }
            else if (quality == "high")
            {
                quality_key = hqdefault;
            }

            return `https://img.youtube.com/vi/${video_id}/${quality_key}.jpg`;
        }
    }
    return false;
}

const PieceThumbnail = (props: { className?: string, piece: PieceType<string>, shouldPlay: boolean }) =>
{
    const piece = props.piece;
    const url = piece.url;
    if (piece.type === "image")
    {
        return (
            <Image className={`aspect-[${piece.width}/${piece.height}] object-cover ${props.className}`} width={piece.width} height={piece.height} src={url} alt={piece.title}/>
        )
    }
    else if (piece.type === "video")
    {
        const thumbnail = getThumbnail(url);
        if (thumbnail)
        {
            return (
                <>
                    <Image src={thumbnail} alt={piece.title} fill={true}
                           className={`${props.className}
                              opacity-100
                              group-hover:opacity-0
                              transition-opacity
                              ease-in-out
                              duration-300
                              object-cover
                              absolute`}/>
                    <PreviewVideo className={props.className} url={url} playing={props.shouldPlay}/>
                </>
            );
        }
        
        return <PreviewVideo className={props.className} url={url} playing={props.shouldPlay}/>;
    }
    else if (piece.type === "videoWithThumbnail")
    {
        return (
            <>
                <Image width={piece.thumbnail.width} height={piece.thumbnail.height} src={piece.thumbnail.url} alt={piece.title}
                       className={`${props.className}
                          opacity-100
                          group-hover:opacity-0
                          transition-opacity
                          ease-in-out
                          duration-300
                          object-cover
                          absolute`}/>
                <PreviewVideo className={props.className} url={url} playing={props.shouldPlay}/>
            </>
        );
    }
};

