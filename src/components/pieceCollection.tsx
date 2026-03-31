"use client";

import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import { getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";
import { VirtualGrid } from "./virtualGrid";
import { type SerializableCollectionLocalized } from "~/types/serializableTypes";

interface CollectionItem {
  piece: PieceType;
  locale: Locale;
  collectionName: string;
  collectionPrettyName: string;
  key: string;
}

const pieceMapper =
  (locale: Locale, collectionName: string, collectionPrettyName: string) =>
  (piece: PieceType): CollectionItem => {
    return {
      piece,
      locale,
      collectionName,
      collectionPrettyName,
      key: getUrlFromPiece(piece),
    };
  };

export const Collections = (props: {
  collections: SerializableCollectionLocalized[];
  locale: Locale;
}) => {
  const thumbnails: CollectionItem[] = props.collections.flatMap(
    (collection) => {
      return [
        pieceMapper(
          props.locale,
          collection.name,
          collection.localizedTitle,
        )(collection.thumbnail),
      ];
    },
  );

  const minItemWidth = 320;
  const maxItemWidth = 800;
  const gap = 24;

  return (
    <VirtualGrid
      items={thumbnails}
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
      gap={gap}
      className="w-full"
      renderItem={(item) => (
        <PiecePreview
          piece={item.piece}
          key={item.key}
          locale={item.locale}
          collectionName={item.collectionName}
          collectionPrettyName={item.collectionPrettyName}
        />
      )}
    />
  );
};
