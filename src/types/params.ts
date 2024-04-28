import { type CollectionId } from "~/cms/collectionManagement";
import { type Locale } from "~/localization/localization";

export type LocalePageParams = {
    locale: Locale,
}

export type CollectionPageParams = {
    collection: CollectionId,
} & LocalePageParams
