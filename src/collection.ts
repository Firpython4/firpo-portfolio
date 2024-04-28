import getOrCompileCms from "./cms/cmsCompiler";
import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { getLocalizedPiece, type Locale, locales } from "./localization/localization";
import { type CollectionPageParams } from "./types/params";

export async function getCollectionsStaticPaths()
{
    const cms = await getOrCacheCompiledCms();

    return locales.map(locale => cms.array.map(collection =>
                                               {
                                                   return {
                                                       collection: collection.id,
                                                       locale: locale
                                                   };
                                               })).flat();
}

export async function getCollectionPageContent(params: CollectionPageParams)
{
    const cms = await getOrCompileCms();

    const collectionId = params.collection;
    const locale = params.locale as Locale;
    
    const collection = cms.map.get(collectionId)!;
    const content = collection.content.get(locale);
    
    if (!content)
    {
        throw new Error(`Collection ${collectionId}doesn't have the ${locale} localization`);
    }
    
    const pieces = collection.pieces.map(piece => getLocalizedPiece(piece, locale));
    
    return {
        content,
        pieces,
        locale
    };
}

