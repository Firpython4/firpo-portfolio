import getOrCompileCms, { replaceNewlines } from "./cms/cmsCompiler";
import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { type CollectionType, type PieceType } from "./cms/cmsSchemas";
import { type Locale, locales } from "./localization/localization";
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

export const toLocalizedPiece = (localizedContent: CollectionType["parsed"][Locale]) => (piece: PieceType) => ({title: replaceNewlines(localizedContent.matters.title) , piece})

export async function getCollectionPageContent(params: CollectionPageParams)
{
    const cms = await getOrCompileCms();

    const targetCollectionName = params.collection;
    const locale = params.locale;
    
    const collection = cms.find(collection => collection.name === targetCollectionName);
    if (collection)
    {
        const localizedContent = collection.parsed[locale];
        const pieces = collection.parsed.pieces.parsed.map(toLocalizedPiece(localizedContent));
        
        return {
            locale,
            pieces,
            content: localizedContent
        };
    }

    throw new Error(`Unable to find collection ${targetCollectionName}`)
}

