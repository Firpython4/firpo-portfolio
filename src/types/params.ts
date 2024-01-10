import { type Locale } from "~/localization/localization";

export type LocalePageParams = {
    locale: Locale,
}

export type CollectionPageParams = {
    collection: Locale,
} & LocalePageParams
