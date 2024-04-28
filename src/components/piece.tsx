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
    if (isHovering)
    {
        console.log("hi")
    }
    return (
        <Link className="relative h-[205px] group" href={piece.linkToCollection} ref={ref}>
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
            <PieceThumbnail piece={piece} shouldPlay={isHovering}/>
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

const PieceThumbnail = (props: {piece: PieceType, shouldPlay: boolean}) =>
{
    const piece = props.piece;
    if (piece.type === "image") {
        return <Image width={364} height={205} src={piece.url} alt={piece.title}/>
    } else {
        const config: YouTubeConfig = {
             playerVars: {
                 controls: 0,
                 disablekb: 1,
                 modestbranding: 1,
                 showinfo: 0
             }
        };
        return (
            <ReactPlayerComponent
                         width={364}
                         height={205}
                         url={piece.url}
                         controls={false}
                         muted={true}
                         loop={true}
                         playing={props.shouldPlay}
                         config={config}/>
        )
    }
}

