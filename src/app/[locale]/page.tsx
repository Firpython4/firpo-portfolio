import type { Metadata } from "next";
import HomeContent from "../../components/homeContent";
import { getIndexPageContent } from "../../index";
import { type LocalePageParams } from "~/types/params";
import { locales, ptLocale } from "../../localization/localization";
import commonMetadata from "../../metadata";

type PageParams = LocalePageParams;

export const generateStaticParams = () =>
{
    return locales.map(locale =>
                       {
                           return {
                               locale
                           }
                       });
};

export const generateMetadata = async () => {
    const pageContent = await getIndexPageContent(ptLocale);
    const metadata: Metadata = {
        ...commonMetadata,
        title: "Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista",
        description: pageContent.localizedCopy.homeMetaDescription
    };
    return metadata
}

const Home = async (props: {params: PageParams}) =>
{
    const content = await getIndexPageContent(props.params.locale);
    return (
        <HomeContent locale={props.params.locale} localizedCopy={content.localizedCopy} pieces={content.pieces}/>
    );
};

export default Home
