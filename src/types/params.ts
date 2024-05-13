import { type Brand } from "~/cms/type-fs/src/typeSafety";
import { type Locale } from "~/localization/localization";

export type CollectionId = Brand<string, "collectionId">;

export type LocalePageParams = {
    locale: Locale,
}

export type CollectionPageParams = {
    collection: CollectionId,
} & LocalePageParams
