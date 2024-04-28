import Image from "next/image";
import Link from "next/link";
import {type PieceType} from "~/types/pieceType";

import {useRef} from "react";
import {useHover} from "usehooks-ts";
import dynamic from 'next/dynamic'
import {VideoPlayer} from "~/components/videoPlayer";
import YouTube, {type YouTubeProps} from "react-youtube";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export const Piece = (props: {piece: PieceType}) =>
{
    const piece = props.piece;
    return (
        <Link className="relative h-[205px] group" href={piece.linkToCollection}>
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
                {piece.title}
            </div>
            <PieceThumbnail piece={piece}/>
        </Link>
    )
}

const opts = {
    playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        loop: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
    }
}

const PieceThumbnail = (props: {piece: PieceType}) =>
{
    const piece = props.piece;
    if (piece.type === "image")
    {
        return <Image width={364} height={205} src={piece.url} alt={piece.title}/>
    }
    else
    {
        const ref = useRef(null);
        const isHovering = useHover(ref);
        return (
        <>
            <YouTube ref={ref}
                         className="w-[364px] h-[205px]"
                         videoId={piece.url}
                         opts={opts}/>
        </>)
    }
}

