import type { GetStaticPropsContext } from "next";
import type { ParsedUrlQuery } from "node:querystring";
import getOrCompileCms, { type CollectionId } from "./cms/cmsCompiler";
import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { getLocalizedPiece, type Locale, locales } from "./localization/localization";

export async function getCollectionsStaticPaths()
{
    const cms = await getOrCacheCompiledCms();
    
    const paths = locales.map(locale => cms.array.map(collection =>
                                                        {
                                                            return {
                                                                params: {
                                                                    collection: collection.id,
                                                                    locale: locale
                                                                }
                                                            };
                                                        })).flat();
    
    return {
        paths: paths,
        fallback: false
    };
}

export async function getCollectionProps(context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>)
{
    const cms = await getOrCompileCms();
    const collectionId = context.params!.collection as CollectionId;
    const locale = context.params!.locale as Locale;
    
    const collection = cms.map.get(collectionId)!;
    const content = collection.content.get(locale);
    
    if (!content)
    {
        throw new Error(`Collection ${collectionId}doesn't have the ${locale} localization`);
    }
    
    const pieces = collection.pieces.map(piece => getLocalizedPiece(piece, locale));
    
    return {
        props: {
            content,
            pieces
        }
    };
}

