import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import { type CollectionType, getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";

    
const pieceMapper = (locale: Locale, collectionName: string) => (piece: PieceType) => {

    return <PiecePreview piece={piece} key={getUrlFromPiece(piece)} locale={locale} collectionName={collectionName} />;
};

export const PieceCollection = (props: {collections: CollectionType[], locale: Locale}) =>
{
    const pieces = props.collections.map(collection => collection.parsed.pieces.parsed.map(pieceMapper(props.locale, collection.name))).flat();
    return (<>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1">
            {pieces}
        </div>
    </>
    );
};