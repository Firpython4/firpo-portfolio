import { type collection, type cms, type piece } from "./cmsSchemas";
import { type InferOk } from "./type-fs/src/types";

export type PieceType = InferOk<typeof piece>;
export type CollectionType = InferOk<typeof collection>;
export type CollectionsType = InferOk<typeof cms>;

export const getUrlFromPiece = (piece: PieceType) =>
  piece.option === 2
    ? piece.value.url
    : piece.option === 0
      ? piece.value.url
      : piece.value.url.url;
