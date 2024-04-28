import { z } from "zod";
import { tcms } from "./tcmsSchemas";

const videoWithThumbnail = tcms.object({
    url: tcms.url(),
    thumbnail: tcms.image()
});

const videoUrl = tcms.url();

export const piece = tcms.union(
    tcms.image(),
    videoUrl,
    videoWithThumbnail
);

const pieces = tcms.array(piece).withName("pieces");

export const collection = tcms.object({
    pieces,
    pt: tcms.markdown("pt").markdownWithContent(z.object({title: z.string()})),
    en: tcms.markdown("en").markdownWithContent(z.object({title: z.string()}))
}).withName();

export const collections = tcms.array(collection);
