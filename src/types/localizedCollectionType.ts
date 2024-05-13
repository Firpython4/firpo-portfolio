import { type Locale, type LocalizedText } from "~/localization/localization";
import { type PieceType } from "./pieceType";
import { type CollectionId } from "./params";

export type LocalizedContentType = Map<Locale, ContentType>;

export type LocalizedCollectionType = {
    content: LocalizedContentType,
    pieces: PieceType<LocalizedText>[]
}

export type UniqueCollectionType = {
    id: CollectionId,
} & LocalizedCollectionType

export type ContentType = {
    html: string,
    asString: string,
    title: string
};


