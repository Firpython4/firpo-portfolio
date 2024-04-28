import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { orderByConfig } from "./cms/ordering";
import { getLocalizedPiece, getLocalizedTexts, type Locale } from "./localization/localization";

export async function getIndexProps(locale: Locale)
{
    const cms = await getOrCacheCompiledCms();
    const pieces = cms.array.map(collection => collection.pieces.map(piece => getLocalizedPiece(piece, locale))).flat();
    
    await orderByConfig(pieces);
    
    return {
        props: {
            pieces,
            localizedTexts: getLocalizedTexts(locale),
            locale
        }
    };
}

