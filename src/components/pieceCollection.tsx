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

export const CollectionsList = (props: {
  collections: SerializableCollectionLocalized[];
  locale: Locale;
}) => {
  const sortedCollections = [...props.collections].sort((a, b) => {
    if (a.order === undefined && b.order === undefined) return 0;
    if (a.order === undefined) return 1;
    if (b.order === undefined) return -1;
    return a.order - b.order;
  });

  const thumbnails = sortedCollections.flatMap(
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
