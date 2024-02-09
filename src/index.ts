import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { orderByConfig } from "./cms/ordering";
import { getLocalizedPiece, getLocalizedCopy, type Locale } from "./localization/localization";
import { type LocalizedCopy } from "./localization/copy";
import { type PieceType } from "./types/pieceType";

export type HomeProps = {
    pieces: PieceType<string>[];
    localizedCopy: LocalizedCopy;
    locale: Locale
};

export async function getIndexPageContent(locale: Locale)
{
    const cms = await getOrCacheCompiledCms();
    const pieces = cms.array.map(collection => collection.pieces.map(piece => getLocalizedPiece(piece, locale))).flat();
    
    await orderByConfig(pieces);

    return {
        pieces,
        localizedCopy: getLocalizedCopy(locale),
        locale
    };
}

