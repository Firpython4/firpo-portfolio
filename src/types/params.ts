import { type Locale } from "~/localization/localization";
import { type CollectionId } from "../cms/cmsCompiler";

export type LocalePageParams = {
    locale: Locale,
}

export type CollectionPageParams = {
    collection: CollectionId,
} & LocalePageParams
