import { type StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

//TODO: make alt required
export const Piece = (props: {image: StaticImageData, title: string, imageAlt: string, link: string}) =>
{
    return (
        <Link className="relative h-[205px] group" href={"/"}>
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
                            text-[24px]">
                Banrisul. <br/> O Grande Banco do Sul
            </div>
            <Image width={364} height={205} src={props.image.src} alt={props.imageAlt}/>;
        </Link>
    )
}
