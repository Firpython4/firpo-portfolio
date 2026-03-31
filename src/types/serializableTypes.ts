import { type Locale } from "~/localization/localization";
import { type LocalizedCopy } from "~/localization/copy";
import { type PieceType } from "~/cms/schemaTypes";

export type SerializableCollection = {
  name: string;
  thumbnail: PieceType;
  pieces?: PieceType[];
};

export type SerializableCollectionLocalized = {
  name: string;
  thumbnail: PieceType;
  pieces?: PieceType[];
  localizedTitle: string;
};

export type HomeProps = {
  collections: SerializableCollection[];
  order?: string;
  localizedCopy: LocalizedCopy;
  locale: Locale;
};
