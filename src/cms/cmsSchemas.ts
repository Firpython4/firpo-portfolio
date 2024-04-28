import { z } from "zod";
import { tcms } from "./type-fs/schemas";

const videoWithThumbnail = tcms.object({
  url: tcms.url(),
  thumbnail: tcms.image("public"),
});

const videoUrl = tcms.url();

export const piece = tcms.union(videoUrl, videoWithThumbnail, tcms.image("public"));

const pieces = tcms.array(piece).withName("pieces");

export const collection = tcms
  .object({
    pieces,
    thumbnail: tcms.object({ thumbnail: piece }).withName("thumbnail"),
    pt: tcms.markdown("pt").withMatter(z.object({ title: z.string() })),
    en: tcms.markdown("en").withMatter(z.object({ title: z.string() })),
  })
  .withName();

export const collections = tcms.array(collection);
