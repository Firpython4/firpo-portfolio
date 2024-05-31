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

const pieces = typefs.array(piece).withName("pieces").optional();

const orderFile = () => typefs.textFile()
  .withName("order")
  .optional();

const content = () => typefs
  .markdown()
  .withMatter(z.object({ title: z.string(), meta: z.string() }));

export const collection = typefs
  .object({
    pieces,
    thumbnail: typefs.object({ thumbnail: piece }).withName("thumbnail"),
    pt: content()
      .withName("pt"),
    en: content().withName("en"),
    order: orderFile(),
  })
  .withName();

export const cms = typefs.object({
  public: typefs.object({ collections: typefs.array(collection).withName("collections") }).withName("public"),
  order: orderFile(),
});
