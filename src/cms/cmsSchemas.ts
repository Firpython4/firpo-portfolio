import { z } from "zod";
import { typefs } from "./type-fs/schemas";

const videoWithThumbnail = typefs.object({
  url: typefs.url(),
  thumbnail: typefs.image("public"),
});

const videoUrl = typefs.url();

export const piece = typefs.union(
  videoUrl,
  videoWithThumbnail,
  typefs.image("public"),
);

const pieces = typefs.array(piece).withName("pieces");

export const collection = typefs
  .object({
    pieces,
    thumbnail: typefs.object({ thumbnail: piece }).withName("thumbnail"),
    pt: typefs.markdown("pt").withMatter(z.object({ title: z.string() })),
    en: typefs.markdown("en").withMatter(z.object({ title: z.string() })),
  })
  .withName();

export const collections = typefs.array(collection);
