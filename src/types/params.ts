import { type Brand } from "@firpy/type-fs";
import { type Locale } from "~/localization/localization";

export type CollectionId = Brand<string, "collectionId">;

export type LocalePageParams = {
  locale: Locale;
};

export type CollectionPageParams = {
  collection: CollectionId;
} & LocalePageParams;
