export type PieceType = ImagePieceType | VideoPieceType;

export type ImagePieceType = {
    type: "image",
} & PieceSharedType & PieceCommonType;

export type VideoPieceType = {
    type: "video",
} & PieceSharedType & PieceCommonType;

export type VideoWithThumbnailPieceType = {
    type: "videoWithThumbnail",
    thumbnailUrl: string,
} & PieceSharedType & PieceCommonType;

export type PieceSharedType = {
    linkToCollection: string,
    collectionTitle: string,
}

type PieceCommonType = {
    url: string
    title: string
}