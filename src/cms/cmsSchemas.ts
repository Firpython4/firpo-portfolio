import { z } from "zod";
import { typefs } from "./type-fs/src/schemas";

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

const orderFile = () => typefs.textFile()
  .withName("order")
  .optional();

export const collection = typefs
  .object({
    pieces,
    thumbnail: typefs.object({ thumbnail: piece }).withName("thumbnail"),
    pt: typefs
      .markdown()
      .withMatter(z.object({ title: z.string() }))
      .withName("pt"),
    en: typefs
      .markdown()
      .withMatter(z.object({ title: z.string() }))
      .withName("en"),
    order: orderFile(),
  })
  .withName();

export const cms = typefs.object({
  collections: typefs.array(collection)
                     .withName("collections"),
  order: orderFile(),
});
