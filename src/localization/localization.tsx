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
export type LocalizedText = Map<Locale, string>;