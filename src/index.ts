import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { orderByConfig } from "./cms/ordering";
import { getLocalizedCopy, type Locale } from "./localization/localization";
import { type LocalizedCopy } from "./localization/copy";
import { toLocalizedPiece } from "./collection";
import { type PieceType } from "./cms/cmsSchemas";

export type HomeProps = {
    pieces: PieceType[];
    localizedCopy: LocalizedCopy;
    locale: Locale
};

export async function getIndexPageContent(locale: Locale)
{
    const cms = await getOrCacheCompiledCms();
    const pieces = cms.map(collection => collection.parsedObject.pieces.map(toLocalizedPiece(collection.parsedObject[locale]))).flat();
    
    await orderByConfig(pieces);

    return {
        pieces,
        localizedCopy: getLocalizedCopy(locale),
        locale
    };
}

