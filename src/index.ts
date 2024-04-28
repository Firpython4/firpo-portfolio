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
    const piecesArray = cms.map(collection => collection.parsed.pieces.parsed).flat();
    const pieces = cms.map(collection => collection.parsed.pieces.parsed.map(toLocalizedPiece(collection.parsed[locale]))).flat();
    await orderByConfig(piecesArray);

    return {
        pieces,
        localizedCopy: getLocalizedCopy(locale),
        locale
    };
}

