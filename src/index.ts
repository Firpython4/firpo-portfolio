import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { getLocalizedCopy, type Locale } from "./localization/localization";
import { type LocalizedCopy } from "./localization/copy";
import { toLocalizedPiece } from "./collection";
import { type CollectionType } from "./cms/cmsSchemas";

export type HomeProps = {
    collections: CollectionType[];
    localizedCopy: LocalizedCopy;
    locale: Locale
};

export async function getIndexPageContent(locale: Locale)
{
    const cms = await getOrCacheCompiledCms();
    const localizedCollections = cms.map(collection => collection.parsed.pieces.parsed.map(toLocalizedPiece(collection.parsed[locale]))).flat();

    return {
        collections: localizedCollections,
        localizedCopy: getLocalizedCopy(locale),
        locale
    };
}

