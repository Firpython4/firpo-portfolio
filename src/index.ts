import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { orderByConfig } from "./cms/ordering";
import { getLocalizedPiece, getLocalizedTexts, type Locale } from "./localization/localization";
import { type LocalizedTexts } from "./localization/texts";
import { type PieceType } from "./types/pieceType";

export type HomeProps = {
    pieces: PieceType<string>[];
    localizedTexts: LocalizedTexts;
    locale: Locale
};

export async function getIndexPageContent(locale: Locale)
{
    const cms = await getOrCacheCompiledCms();
    const pieces = cms.array.map(collection => collection.pieces.map(piece => getLocalizedPiece(piece, locale))).flat();
    
    await orderByConfig(pieces);

    return {
        pieces,
        localizedTexts: getLocalizedTexts(locale),
        locale
    };
}

