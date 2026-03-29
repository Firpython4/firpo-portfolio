import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import {
  type CollectionType,
  getUrlFromPiece,
  type PieceType,
} from "~/cms/schemaTypes";
import { collectionNameProvider, orderByConfig } from "~/cms/ordering";

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

export const Collections = (props: {
  collections: CollectionType[];
  locale: Locale;
  orderFile?: Buffer;
}) => {
  if (props.orderFile) {
    orderByConfig(props.collections, collectionNameProvider, props.orderFile);
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
    <div className="grid gap-[clamp(8px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(clamp(160px,35vw,400px),1fr))]">
      {thumbnails}
    </div>
  );
};
