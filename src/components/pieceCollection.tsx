import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import {
  type CollectionType,
  getUrlFromPiece,
  type PieceType,
} from "~/cms/schemaTypes";
import { orderCollectionsByConfig } from "~/cms/ordering";

const pieceMapper =
  (locale: Locale, collectionName: string, collectionPrettyName: string) =>
  (piece: PieceType) => {
    return (
      <PiecePreview
        piece={piece}
        key={getUrlFromPiece(piece)}
        locale={locale}
        collectionName={collectionName}
        collectionPrettyName={collectionPrettyName}
      />
    );
  };

export const PieceCollection = (props: {
  collections: CollectionType[];
  locale: Locale;
  orderFile?: Buffer;
}) => {
  if (props.orderFile) {
    orderCollectionsByConfig(props.collections, props.orderFile);
  }
  const thumbnails = props.collections.map((collection) => {
    const thumbnail = collection.parsed.thumbnail.parsed.thumbnail;
    return pieceMapper(
      props.locale,
      collection.name,
      collection.parsed[props.locale].parsed.matters.title,
    )(thumbnail);
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-1 lg:grid-cols-2 xl:grid-cols-3">
        {thumbnails}
      </div>
    </>
  );
};
