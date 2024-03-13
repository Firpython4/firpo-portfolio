"use client"

import ExportedImage from "next-image-export-optimizer";
import dynamic from "next/dynamic";

import { useRef } from "react";
import { type YouTubeConfig } from "react-player/youtube";
import { useHover } from "usehooks-ts";
import { type PieceType } from "~/types/pieceType";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";
import LinkWithLocale from "./LinkWithLocale";

const YoutubeReactPlayerComponent = dynamic(() => import("react-player/youtube"), {ssr: false});
const VimeoReactPlayerComponent = dynamic(() => import("react-player/vimeo"), {ssr: false});

export const PiecePreview = (props: { piece: PieceType<string>, locale: Locale }) =>
{
    const piece = props.piece;
    const ref = useRef(null);
    const isHovering = useHover(ref);
    return (
        <LinkWithLocale
            className="relative aspect-[364/205] max-w-[364px] max-h-[205px] group overflow-hidden flex items-center"
            href={piece.linkToCollection} ref={ref} locale={props.locale}>
            <div className="opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            ease-in
                            duration-150
                            bg-black/70 w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            absolute
                            font-inter
                            font-medium
                            text-white
                            text-center
                            sm:text-[24px]
                            mobile_md:text-[22px]
                            text-[12px]
                            p-6
                            whitespace-pre-wrap">
                {piece.collectionName}
            </div>
            <PieceThumbnail piece={piece} shouldPlay={isHovering}/>
        </LinkWithLocale>
    );
};

export const PieceVideo = (props: PropsWithClassName<{
    url: string,
    playing: boolean,
    muted: boolean,
    controls: boolean,
    width?: number,
    height?: number,
    youtubeConfig: YouTubeConfig
}>) =>
{
    if (props.url.includes("youtube"))
    {
        return <YoutubeReactPlayerComponent
            width="100%"
            height="100%"
            url={props.url}
            controls={props.controls}
            muted={props.muted}
            loop={true}
            playing={props.playing}
            config={props.youtubeConfig}/>;
    }
    else if (props.url.includes("vimeo"))
    {
        return <VimeoReactPlayerComponent
            width="100%"
            height="100%"
            url={props.url}
            controls={props.controls}
            muted={props.muted}
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

const pieceThumbnailSizes = `100svw, screen(mobile_lg) 364px`;

const PieceThumbnail = (props: PropsWithClassName<{piece: PieceType<string>, shouldPlay: boolean }>) =>
{
    const piece = props.piece;
    const url = piece.url;
    if (piece.type === "image")
    {
        return (
            <ExportedImage className={`aspect-[${piece.width}/${piece.height}] object-cover ${props.className}`} width={piece.width} height={piece.height} src={url} alt={piece.title} sizes={pieceThumbnailSizes}/>
        )
    }
    else
    {
        const youTubeConfig: YouTubeConfig = {
            playerVars: {
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                showinfo: 0
            }
        };

        if (piece.type === "video")
        {
            
            const thumbnail = getThumbnail(url);
            if (thumbnail)
            {
                return (
                    <>
                        <ExportedImage src={thumbnail} alt={piece.title} fill={true} sizes={pieceThumbnailSizes} unoptimized={true}
                               className={`${props.className}
                                  opacity-100
                                  group-hover:opacity-0
                                  transition-opacity
                                  ease-in-out
                                  duration-300
                                  object-cover
                                  absolute`}/>
                        <PieceVideo className={props.className} url={url} playing={props.shouldPlay} width={364} height={205} youtubeConfig={youTubeConfig} muted={true} controls={false}/>
                    </>
                );
            }
            
            return <PieceVideo className={props.className} url={url} playing={props.shouldPlay} width={364} height={205} youtubeConfig={youTubeConfig} muted={true} controls={false}/>;
        }
        else if (piece.type === "videoWithThumbnail")
        {
            return (
                <>
                    <ExportedImage width={piece.thumbnail.width} height={piece.thumbnail.height} src={piece.thumbnail.url} alt={piece.title} sizes={pieceThumbnailSizes}
                           className={`${props.className}
                              opacity-100
                              group-hover:opacity-0
                              transition-opacity
                              ease-in-out
                              duration-300
                              object-cover
                              absolute`}/>
                    <PieceVideo className={props.className} url={url} playing={props.shouldPlay} width={364} height={205} youtubeConfig={youTubeConfig} muted={true} controls={false}/>
                </>
            );
        }
    }
};

