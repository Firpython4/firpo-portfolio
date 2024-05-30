import { type Metadata } from "next";
import { permanentRedirect, RedirectType } from "next/navigation";
import { getIndexPageContent } from "~/index";
import { ptLocale } from "~/localization/localization";
import commonMetadata from "../metadata";

export const generateMetadata = async () => {
  const pageContent = await getIndexPageContent(ptLocale);
  const metadata: Metadata = {
    ...commonMetadata,
    title:
      "Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista",
    description: pageContent.localizedCopy.home.meta.description,
  };
  return metadata;
};

const FallbackHome = () => {
  Redirector("/pt");
};

const Redirector = (url: string) => {
  permanentRedirect(url, RedirectType.replace);
};

export default FallbackHome;
