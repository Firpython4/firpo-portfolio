import Image from "next/image";
import Link from "next/link";
import {type PieceType} from "~/types/pieceType";

import {useRef} from "react";
import {useHover} from "usehooks-ts";
import dynamic from 'next/dynamic'
import {type YouTubeConfig} from "react-player/youtube";
const ReactPlayerComponent = dynamic(() => import("react-player/youtube"), { ssr: false });

export const Piece = (props: {piece: PieceType}) =>
{
    const piece = props.piece;
    const ref = useRef(null);
    const isHovering = useHover(ref);
    return (
        <Link className="relative max-w-[364px] max-h-[205px] group overflow-hidden flex items-center" href={piece.linkToCollection} ref={ref}>
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
                {piece.collectionTitle}
            </div>
            <PieceThumbnail piece={piece} shouldPlay={isHovering}/>
        </Link>
)
}

const PreviewVideo = (props: {
    url: string,
    playing: boolean,
    className?: string
}) =>
{
    const config: YouTubeConfig = {
        playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            showinfo: 0
        }
    };
    return <ReactPlayerComponent
        width={364}
        height={205}
        url={props.url}
        controls={false}
        muted={true}
        loop={true}
        playing={props.playing}
        config={config}/>;
};

const PieceThumbnail = (props: {className?: string, piece: PieceType, shouldPlay: boolean}) =>
{
    const piece = props.piece;
    const url = piece.url;
    if (piece.type === "image")
    {
        return <Image className={props.className} width={364} height={205} src={url} alt={piece.title}/>
    }
    else if (piece.type === "video")
    {
        return (
            <PreviewVideo className={props.className} url={url} playing={props.shouldPlay}/>
        )
    }
    else if (piece.type === "videoWithThumbnail")
    {
        return (
            <>
                <Image width={364} height={205} src={piece.thumbnailUrl} alt={piece.title}
                      className={`${props.className} opacity-100
                          group-hover:opacity-0
                          transition-opacity
                          ease-in-out
                          duration-300
                          w-full
                          h-full
                          absolute`}/>
                <PreviewVideo className={props.className} url={url} playing={props.shouldPlay}/>
            </>
        )
    }
}

