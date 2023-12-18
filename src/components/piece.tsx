import { type StaticImageData } from "next/image";
import Image from "next/image";

//TODO: make alt required
export const Piece = (props: {image: StaticImageData, alt: string}) => <Image width={364} height={205} src={props.image.src} alt={props.alt}/>;