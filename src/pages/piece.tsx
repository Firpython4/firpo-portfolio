import { StaticImageData } from "next/image";

export const Piece = (props: {image: StaticImageData}) => <img className="w-[364px] h-[205px]" src={props.image.src}/>;