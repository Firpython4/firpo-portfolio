import { type Locale, type LocalizedText } from "~/localization/localization";
import { type CollectionId } from "~/cms/cmsCompiler";
import { type PieceType } from "./pieceType";

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


