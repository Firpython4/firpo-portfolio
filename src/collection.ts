import getOrCompileCms, { replaceNewlines } from "./cms/cmsCompiler";
import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { locales } from "./localization/localization";
import { type CollectionPageParams } from "./types/params";

export async function getCollectionsStaticPaths()
{
    const cms = await getOrCacheCompiledCms();

    return locales.map(locale => cms.map(collection =>
                                               {
                                                   return {
                                                       collection: collection.name,
                                                       locale: locale
                                                   };
                                               })).flat();
}

export async function getCollectionPageContent(params: CollectionPageParams)
{
    const cms = await getOrCompileCms();

    const targetCollectionName = params.collection;
    const locale = params.locale;
    
    const collection = cms.find(collection => collection.name === targetCollectionName);
    if (collection)
    {
        return {
            locale,
            pieces: collection.parsed.pieces,
            content: collection.parsed[locale]
        };
    }

    throw new Error(`Unable to find collection ${targetCollectionName}`)
}

