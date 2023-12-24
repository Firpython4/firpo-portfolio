import { type PieceType } from "../types/pieceType";
import { Piece } from "./piece";

export const PieceCollection = (props: {images: PieceType[]}) =>
(
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {
                props.images.map((imageWithLink: PieceType) => <Piece image={imageWithLink.image} link={imageWithLink.link} title={imageWithLink.title} key={imageWithLink.image}/>)
            }
        </div>
    </>
);