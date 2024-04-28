import { type TextType } from "~/localization/localization";

export type PieceType<GenericTextType extends TextType> = (ImagePieceType | VideoPieceType | VideoWithThumbnailPieceType) & PieceSharedType<GenericTextType> & PieceCommonType;

export type ImagePieceType = {
    type: "image",
    width: number,
    height: number
}

export type VideoPieceType = {
    type: "video",
}

export type VideoWithThumbnailPieceType = {
    type: "videoWithThumbnail",
    thumbnailUrl: string,
}

export type PieceSharedType<GenericTextType extends TextType> = {
    linkToCollection: string,
    collectionName: GenericTextType,
}

type PieceCommonType = {
    url: string
    title: string
}