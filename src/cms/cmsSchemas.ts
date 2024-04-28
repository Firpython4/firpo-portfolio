import { z } from "zod";
import { type Infer, tcms } from "./tcmsTypes";

const videoWithThumbnail = tcms.object({
    url: tcms.url(), thumbnail: tcms.image()
}).withName();

const video = tcms.union(
    tcms.url(),
    videoWithThumbnail
)

const piece = tcms.union(
    tcms.image(),
    video
);

export type PieceType = Infer<typeof piece>;

const pieces = tcms.array(piece);

const collection = tcms.object({
    pieces,
    pt: tcms.markdown("pt").markdownWithContent(z.object({title: z.string()})),
    en: tcms.markdown("en").markdownWithContent(z.object({title: z.string()}))
}).withName();

export type CollectionType = Infer<typeof collection>;

export const collections = tcms.array(collection);
export type CollectionsType = Infer<typeof collections>;
