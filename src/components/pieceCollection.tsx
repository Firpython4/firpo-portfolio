import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import { type CollectionType, getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";

    
const pieceMapper = (locale: Locale, collectionName: string, collectionPrettyName: string) => (piece: PieceType) => {

    return <PiecePreview piece={piece} key={getUrlFromPiece(piece)} locale={locale} collectionName={collectionName} collectionPrettyName={collectionPrettyName}/>;
};

export const PieceCollection = (props: {collections: CollectionType[], locale: Locale}) =>
{
    const thumbnails = props.collections.map(collection => {
        const thumbnail = collection.parsed.thumbnail.parsed.thumbnail;
        return pieceMapper(props.locale, collection.name, collection.parsed[props.locale].parsed.matters.title)(thumbnail);
    });

    return (<>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1">
            {thumbnails}
        </div>
    </>
    );
};