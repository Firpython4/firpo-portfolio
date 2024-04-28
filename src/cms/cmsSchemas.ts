import { z } from "zod";
import { tcms } from "./tcmsSchemas";

const videoWithThumbnail = tcms.object({
    url: tcms.url(),
    thumbnail: tcms.image()
});

const videoUrl = tcms.url();

export const piece = tcms.union(
    videoUrl,
    videoWithThumbnail,
    tcms.image()
);

const pieces = tcms.array(piece).withName("pieces");

export const collection = tcms.object({
    pieces,
    pt: tcms.markdown("pt").withMatter(z.object({title: z.string()})),
    en: tcms.markdown("en").withMatter(z.object({title: z.string()}))
}).withName();

export const collections = tcms.array(collection);
