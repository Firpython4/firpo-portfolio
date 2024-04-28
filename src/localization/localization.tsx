import {useRouter} from "next/router";
import React from "react";
import {type LocalizedContentType} from "~/pages/[locale]/collections/[collection]";

type LocaleTexts = {
    clients: React.JSX.Element;
    subtitle: React.JSX.Element;
    name: React.JSX.Element;
    someAttendedClients: React.JSX.Element;
    expositionFirst: React.JSX.Element;
    solveYourCommunicationProblems: React.JSX.Element
};

const en_us: LocaleTexts = {
    name: <>Marcelo Firpo</>,
    subtitle: <>CMO, Creative Director, Creative Consultant, Copywriter, Screenwriter</>,
    expositionFirst: <>T
        I have more than 30 years of experience in communication, advertising, and branding. I've been awarded at multiple festivals.
        <br/>As CMO, I am responsible for marketing and prospecting strategies for a global IT and data solutions company, serving clients in the US, Europe, and LATAM.
        <br/>As Creative Director, I worked with major brands in the Brazilian market in segments such as banking/finance, energy, public administration, healthcare, education, services, and retail.
        <br/>Working happily from Lisbon, Portugal, I offer services in projects related to creativity (branding, campaigns, actions, creative direction, copywriting) and text production in general (audiovisual entertainment-related projects are especially welcome).
</>,
    someAttendedClients: <>Alguns clientes atendidos:</>,
    clients: <>Grupo Telefónica, Petrobras, Vivo, Grupo Braskem, Edenred, Aegea, Banrisul, Grupo Gerdau, Midea-Carrier,
        Springer, GRU Airport, Husqvarna, Massey Ferguson, John Deere, Grupo RBS, Zero Hora, Ramarim, Klabin, Sicredi,
        Abicalçados, Sistema FIERGS, Paquetá, Gaston, Nutrella, Laghetto Hotéis, Piccadilly, Yara, Sescoop, Voopter,
        Op'n'Go, Vinhos Miolo, Oxiteno, Senac, Fecomércio, SC Internacional, UCS, Correio do Povo, Record, Hospital Moinhos
        de Vento, Governo do Rio Grande do Sul, Governo de Santa Catarina, Daer, Sulgás, Detran, CEEE, Corsan, Grupo
        Zaffari, Supermercados Angeloni, Tintas Renner, Sayerlack, Selenium, Cerâmicas Oxford, Student Travel Bureau, Lojas
        Colombo Stores, Rede de Concessionárias Fiat e as seguintes prefeituras: Porto Alegre, Passo Fundo, Bento Gonçalves,
        Gravataí, Santa Maria e Rio Grande.</>,
    solveYourCommunicationProblems: <>Resolva seus problemas de comunicação:</>
}

const pt_br: LocaleTexts = {
    name: <>Marcelo Firpo</>,
    subtitle: <>CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista</>,
    expositionFirst: <>Tenho
        mais de 30 de experiência em comunicação, publicidade e branding, e já fui premiado em múltiplos
        festivais.<br/>Como CMO, sou o responsável pelo marketing e estratégias de prospecção de uma empresa
        global de soluções de TI e dados, atendendo a clientes nos EUA, Europa e LATAM.<br/>Como Diretor de
        Criação, trabalhei com grandes marcas do mercado brasileiro em segmentos como financeiro, energia,
        administração pública, saúde, educação, serviços e varejo.<br/>Trabalhando feliz a partir de Lisboa,
        Portugal, ofereço serviços em projetos relacionados a criatividade (branding, campanhas, ações,
        direção de criação, redação) e produção textual em geral (projetos na área de entretenimento
        audiovisual são especialmente bem-vindos).</>,
    someAttendedClients: <>Some customers served:</>,
    clients: <>Telefónica Group,
        Petrobras,
        Vivo,
        Braskem Group,
        Edenred,
        Aegea Group,
        Banrisul,
        Gerdau Group,
        Midea-Carrier,
        Springer,
        GRU Airport,
        Husqvarna,
        Massey Ferguson,
        John Deere,
        RBS Group,
        Zero Hora newspaper,
        Ramarim Shoes,
        Klabin Group,
        Sicredi,
        Abicalçados,
        Sistema FIERGS,
        Paquetá,
        Gaston,
        Nutrella,
        Laghetto Hotels,
        Piccadilly Shoes,
        Yara,
        Sescoop,
        Voopter,
        Op'n'Go,
        Miolo Wines,
        Oxiteno Chemicals,
        Senac,
        Fecomércio,
        SC Internacional,
        UCS,
        Correio do Povo,
        Record,
        Moinhos de Vento Hospital,
        Rio Grande do Sul Government,
        Santa Catarina Government,
        Daer,
        Sulgás,
        Detran,
        CEEE,
        Corsan,
        Zaffari Group,
        Angeloni Supermarkets,
        Renner Paints,
        Sayerlack,
        Selenium Loudspeakers,
        Oxford Ceramics,
        Student Travel Bureau,
        Colombo Stores,
        Fiat Dealership Network,
        and the following city halls:
        Porto Alegre,
        Passo Fundo,
        Bento Gonçalves,
        Gravataí,
        Santa Maria,
        and Rio Grande.</>,
    solveYourCommunicationProblems: <>Solve your communication problems:</>
}

const texts: Record<Locale, LocaleTexts> = {
    "pt-BR": pt_br,
    "en-US": en_us
}

export type Locale = "pt-BR" | "en-US";
export const locales = ["pt-BR" as const, "en-US" as const];

export function useLocaleTexts()
{
    const router = useRouter();

    const locale = router.query.locale;
    if (locale && (locale === "pt-BR" || locale === "en-US"))
    {
        return texts[locale];
    }
    else
    {
        throw new Error("Unsupported locale");
    }
}

export function useLocale()
{
    const router = useRouter();

    const locale = router.query.locale;
    if (locale && (locale === "pt-BR" || locale === "en-US"))
    {
        return locale;
    }
    else
    {
        throw new Error("Unsupported locale");
    }
}

export function getLocalizedString(localizedText: LocalizedText)
{
    const locale = useLocale();

    const keys: Map<Locale, string> = localizedText.keys;
    if (keys.has(locale))
    {
        return keys.get(locale);
    }

    const defaultLocalizedText = keys.get(localizedText.defaultLocale);
    if (!defaultLocalizedText)
    {
        throw new Error("No default localized string found")
    }
    return defaultLocalizedText;
}

export function getLocalizedContent(localizedContent: LocalizedContentType)
{
    const locale = useLocale();
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
