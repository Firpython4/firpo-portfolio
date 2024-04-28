import { type TextType } from "~/localization/localization";

export type ImagePieceType = {
    type: "image",
} & ImageSize

type ImageSize = {
    width: number,
    height: number
}

export type Thumbnail = {
    url: string
} & ImageSize

export type VideoPieceType = {
    type: "video",
}

export type VideoWithThumbnailPieceType = {
    type: "videoWithThumbnail",
    thumbnail: Thumbnail,
}

export type PieceSharedType<GenericTextType extends TextType> = {
    linkToCollection: string,
    collectionName: GenericTextType,
}

