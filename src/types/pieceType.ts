export type PieceType = ImagePieceType | VideoPieceType;

export type ImagePieceType = {
    type: "image",
} & PieceSharedType;

export type VideoPieceType = {
    type: "video",
} & PieceSharedType;

type PieceSharedType = {
    url: string
    linkToCollection: string,
    collectionTitle: string,
    title: string
}
