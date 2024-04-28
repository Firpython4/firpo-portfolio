import { type StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

//TODO: make alt required
export const Piece = (props: {image: StaticImageData | string, title: string, link: string}) =>
{
    const image = props.image;
    return (
        <Link className="relative h-[205px] group" href={props.link}>
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
                {props.title}
            </div>
            {
                typeof image === "string" ? <Image width={364} height={205} src={image} alt={props.title}/>
                                                  : <Image width={364} height={205} src={image.src} alt={props.title}/>
            }
        </Link>
    )
}
