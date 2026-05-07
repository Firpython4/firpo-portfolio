import type { Metadata } from "next";
import HomeContent from "../../../components/homeContent";
import { getIndexPageContent } from "../../../index";
import { type LocalePageParams } from "~/types/params";
import { locales } from "../../../localization/localization";
import commonMetadata from "../../../metadata";
import { collectionNameProvider, orderByConfig } from "~/cms/ordering";

type PageParams = LocalePageParams;

export const generateStaticParams = () => {
  return locales.map((locale) => {
    return {
      locale,
    };
  });
};

export const generateMetadata = async (props: { params: Promise<LocalePageParams> }) => {
  const params = await props.params;
  const pageContent = await getIndexPageContent(params.locale);
  const metadata: Metadata = {
    ...commonMetadata,
    title:
      "Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista",
    description: pageContent.localizedCopy.home.meta.description,
  };
  return metadata;
};

const Home = async (props: { params: Promise<PageParams> }) => {
  const params = await props.params;
  const content = await getIndexPageContent(params.locale);
  return (
    <HomeContent
      locale={params.locale}
      localizedCopy={content.localizedCopy}
      collections={content.collections}
    />
  );
};

export default Home;
