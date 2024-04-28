import {type LocalizedContentType} from "../pages/[locale]/collections/[collection]";
import { en, pt, type LocaleTexts } from "./texts";

const texts: Record<Locale, LocaleTexts> = {
    pt: pt,
    en: en
}

export const ptLocale = "pt" as const;
export const enLocale = "en" as const;
export const locales = [ptLocale, enLocale];
export type Locale = typeof locales[number];

export function useLocaleTexts(locale: Locale)
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
export function useLocalizedContent(localizedContent: LocalizedContentType, locale: Locale)
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
