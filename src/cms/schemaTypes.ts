import { type collection, type collections, type piece } from "./cmsSchemas";
import { type InferOk } from "./tcmsTypes";

export type PieceType = InferOk<typeof piece>;
export type CollectionType = InferOk<typeof collection>;
export type CollectionsType = InferOk<typeof collections>;

export const getUrlFromPiece = (piece: PieceType) => piece.option === 0 ? piece.value.url
                                                                        : piece.option === 1 ? piece.value.value
                                                                                             : piece.value.url.value;