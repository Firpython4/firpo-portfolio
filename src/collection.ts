import getOrCompileCms from "./cms/cmsCompiler";
import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { locales } from "./localization/localization";
import { type CollectionPageParams } from "./types/params";

export async function getCollectionsStaticPaths() {
  const cms = await getOrCacheCompiledCms();

  return locales
    .map((locale) =>
      cms.collections.parsed.map((collection) => {
        return {
          collection: collection.name,
          locale: locale,
        };
      }),
    )
    .flat();
}

export async function getCollectionPageContent(params: CollectionPageParams) {
  const cms = await getOrCompileCms();

  const targetCollectionName = params.collection;
  const locale = params.locale;

  const collection = cms.collections.parsed.find(
    (collection) => collection.name === targetCollectionName,
  );
  if (collection) {
    return {
      locale,
      order: collection.parsed.order,
      pieces: [
        collection.parsed.thumbnail.parsed.thumbnail,
        ...collection.parsed.pieces.parsed,
      ],
      content: collection.parsed[locale],
    };
  }

  throw new Error(`Unable to find collection ${targetCollectionName}`);
}
