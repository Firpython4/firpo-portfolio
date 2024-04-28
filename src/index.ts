import getOrCacheCompiledCms from "./cms/cmsCompiler";
import { getLocalizedCopy, type Locale } from "./localization/localization";
import { type LocalizedCopy } from "./localization/copy";
import { type CollectionType } from "./cms/schemaTypes";

export type HomeProps = {
    collections: CollectionType[];
    localizedCopy: LocalizedCopy;
    locale: Locale
};

export async function getIndexPageContent(locale: Locale)
{
    const collections = await getOrCacheCompiledCms();

    return {
        collections: collections,
        localizedCopy: getLocalizedCopy(locale),
        locale
    };
}

