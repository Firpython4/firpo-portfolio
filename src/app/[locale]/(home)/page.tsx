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

export const generateMetadata = async (props: { params: LocalePageParams }) => {
  const pageContent = await getIndexPageContent(props.params.locale);
  const metadata: Metadata = {
    ...commonMetadata,
    title:
      "Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista",
    description: pageContent.localizedCopy.home.meta.description,
  };
  return metadata;
};

const Home = async (props: { params: PageParams }) => {
  const content = await getIndexPageContent(props.params.locale);
  const collections = [...content.cms.public.parsed.collections.parsed];
  if (content.cms.order?.parsed) {
    orderByConfig(
      collections,
      collectionNameProvider,
      content.cms.order.parsed,
    );
  }
  return (
    <HomeContent
      locale={props.params.locale}
      localizedCopy={content.localizedCopy}
      collections={collections}
    />
  );
};

export default Home;
