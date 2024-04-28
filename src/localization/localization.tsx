import {type LocalizedContentType} from "../pages/[locale]/collections/[collection]";
import { en_us, pt_br, type LocaleTexts } from "./texts";

const texts: Record<Locale, LocaleTexts> = {
    "pt-BR": pt_br,
    "en-US": en_us
}

export type Locale = "pt-BR" | "en-US";
export const locales = ["pt-BR" as const, "en-US" as const];

export function useLocaleTexts(locale: Locale)
{
    if (locale && (locale === "pt-BR" || locale === "en-US"))
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


export type LocalizedText = {
    keys: Map<Locale, string>;
    defaultLocale: Locale;
}
