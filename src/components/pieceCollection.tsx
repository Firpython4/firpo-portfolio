"use client";

import { type Locale } from "~/localization/localization";
import { PiecePreview } from "./piecePreview";
import {
  type CollectionType,
  getUrlFromPiece,
  type PieceType,
} from "~/cms/schemaTypes";
import { VirtualGrid } from "./virtualGrid";

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
  collections: CollectionType[];
  locale: Locale;
}) => {
  const thumbnails: CollectionItem[] = props.collections.flatMap(
    (collection) => {
      const thumbnail = collection.parsed.thumbnail.parsed.thumbnail;
      return [
        pieceMapper(
          props.locale,
          collection.name,
          collection.parsed[props.locale].parsed.matters.title,
        )(thumbnail),
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
