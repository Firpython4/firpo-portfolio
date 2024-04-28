import { type LocalizedContentType } from "../types/localizedCollectionType";
import type { PieceType } from "../types/pieceType";
import { en, pt, type LocalizedCopy } from "./copy";

const texts: Record<Locale, LocalizedCopy> = {
    pt: pt,
    en: en
}

export type TextType = LocalizedText | string;

export const ptLocale = "pt" as const;
export const enLocale = "en" as const;
export const locales = [ptLocale, enLocale];
export type Locale = typeof locales[number];

export function getLocalizedCopy(locale: Locale)
{
    if (locale && (locale === ptLocale || locale === enLocale))
    {
        return texts[locale];
    }
    else
    {
        throw new Error("Unsupported locale");
    }
}
export function getLocalizedContent(localizedContent: LocalizedContentType, locale: Locale)
{
    const content = localizedContent.get(locale);
    if (content)
    {
        return content;
    }
    else
    {
        throw new Error("No default localized string found")
    }
}

export function getLocalizedPiece(piece: PieceType<LocalizedText>, locale: Locale)
{
    const localizedCollectionName = piece.collectionName.get(locale);
    
    if (!localizedCollectionName)
    {
        throw new Error(`Unable to find localized collection name for ${piece.title} using locale ${locale}`)
    }
    
    return {
        ...piece,
        collectionName: localizedCollectionName,
    }
}

export type LocalizedText = Map<Locale, string>;