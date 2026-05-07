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

  const collections: SerializableCollectionLocalized[] =
    cms.public.parsed.collections.parsed.map((col) => {
      return {
        name: col.name,
        thumbnail: col.parsed.thumbnail.parsed.thumbnail,
        pieces: col.parsed.pieces?.parsed,
        localizedTitle: col.parsed[locale].parsed.matters.title,
      };
    });

  return {
    collections,
    localizedCopy: getLocalizedCopy(locale),
  };
}
