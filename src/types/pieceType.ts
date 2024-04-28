export type PieceType = ImagePieceType | VideoPieceType;

export type ImagePieceType = {
    type: "image",
    url: string
    title: string
} & PieceSharedType;

export type VideoPieceType = {
    type: "video",
    url: string
    title: string
} & PieceSharedType;

export type PieceSharedType = {
    linkToCollection: string,
    collectionTitle: string,
}
