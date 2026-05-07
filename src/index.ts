import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { getLocalizedCopy, type Locale } from "./localization/localization";
import { type LocalizedCopy } from "./localization/copy";
import { type SerializableCollectionLocalized } from "./types/serializableTypes";

export type HomeProps = {
  collections: SerializableCollectionLocalized[];
  localizedCopy: LocalizedCopy;
  locale: Locale;
};

export async function getIndexPageContent(locale: Locale) {
  const cms = await getOrCacheCompiledCms();

  const orderContent = cms.order?.parsed?.toString();
  const orderMap = new Map<string, number>();
  if (orderContent) {
    orderContent.split("\n").forEach((name, index) => {
      orderMap.set(name.trim(), index);
    });
  }

  const collections: SerializableCollectionLocalized[] =
    cms.public.parsed.collections.parsed.map((col) => {
      return {
        name: col.name,
        thumbnail: col.parsed.thumbnail.parsed.thumbnail,
        pieces: col.parsed.pieces?.parsed,
        localizedTitle: col.parsed[locale].parsed.matters.title,
        order: orderMap.get(col.name),
      };
    });

  return {
    collections,
    localizedCopy: getLocalizedCopy(locale),
  };
}
