import { type PieceType } from "~/types/pieceType";
import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";

export const PieceCollection = (props: {pieces: PieceType<string>[], locale: Locale}) =>
(
    <>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-0">
            {
                props.pieces.map((piece: PieceType<string>) => <PiecePreview piece={piece} key={piece.url} locale={props.locale}/>)
            }
        </div>
    </>
);