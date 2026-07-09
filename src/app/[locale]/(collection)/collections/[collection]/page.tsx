import { type Metadata } from "next";

import {
  getCollectionPageContent,
  getCollectionsStaticPaths,
} from "~/collection";

import LinkWithLocale from "~/components/LinkWithLocale";

import { type Locale } from "~/localization/localization";

import { type CollectionPageParams } from "~/types/params";

import commonMetadata from "../../../../../metadata";

import { replaceNewlines } from "~/cms/cmsCompiler";

import { orderByConfig, pieceNameProvider } from "~/cms/ordering";
import Scaffold from "~/components/scaffold";
import { CollectionPieces } from "~/components/collectionPieces";
import { SiteNav } from "~/components/siteNav";
import { Reveal } from "~/components/Reveal";
import { emailLink } from "~/config";

export const generateStaticParams = async () => {
  return await getCollectionsStaticPaths();
};

type PageParams = CollectionPageParams;

export const generateMetadata = async (props: { params: Promise<PageParams> }) => {
  const params = await props.params;
  const pageContent = await getCollectionPageContent(params);

  const metadata: Metadata = {
    ...commonMetadata,

    title: `Marcelo Firpo - ${pageContent.content.parsed.matters.title}`,

    description: pageContent.content.parsed.matters.meta,
  };

  return metadata;
};

import { ArrowLeft } from "lucide-react";

const BackButton = (props: { locale: Locale; collectionName: string; className?: string }) => {
  return (
    <LinkWithLocale href={`/#${props.collectionName}`} locale={props.locale}>
      <ArrowLeft className={`h-6 w-6 text-ink hover:text-sunrise transition-colors ${props.className}`} />
    </LinkWithLocale>
  );
};

const Collection = async (props: { params: Promise<PageParams> }) => {
  const params = await props.params;
  const pageContent = await getCollectionPageContent(params);

  if (pageContent.order?.parsed) {
    orderByConfig(
      pageContent.piecesWithoutThumbnail,
      pieceNameProvider,
      pageContent.order.parsed,
    );
  }

  const dangerouslySetInnerHTML = {
    __html: pageContent.content.parsed.html,
  };

  const locale = pageContent.locale as Locale;

  return (
    <>
      <SiteNav
        navLinks={locale === "pt"
          ? [{ label: "Início", href: "/" }]
          : [{ label: "Home", href: "/" }]
        }
        ctaLabel={locale === "pt" ? "Contacto" : "Contact"}
        ctaHref={emailLink}
        locale={locale}
      />
      <Scaffold>
        <div className="py-16 lg:py-32 px-6 lg:px-12 bg-dawn">
          <div className="max-w-[70ch] mx-auto">
            <Reveal>
              <BackButton
                locale={locale}
                collectionName={params.collection}
                className="mb-8 lg:mb-12"
              />
            </Reveal>
            <Reveal>
              <h2 className="font-serif font-semibold text-[clamp(1.8rem,4vw,3.6rem)] text-ink leading-[1.1] tracking-tight">
                {replaceNewlines(pageContent.content.parsed.matters.title)}
              </h2>
            </Reveal>
            <div
              className="mt-6 lg:mt-8 font-sans text-[clamp(1rem,1.5vw,1.15rem)] text-[#5A5855] leading-[1.65] max-w-[70ch]"
              dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            />
          </div>
        </div>

        <div className="py-16 lg:py-32 px-6 lg:px-12 bg-dawn flex flex-col items-center">
          <CollectionPieces
            gap={80}
            pieces={[
              pageContent.thumbnail,
              ...(pageContent.piecesWithoutThumbnail ?? []),
            ]}
          />
          <div className="mt-12 lg:mt-20">
            <BackButton
              locale={locale}
              collectionName={params.collection}
            />
          </div>
        </div>

        <footer className="py-6 lg:py-8 px-6 lg:px-12 bg-ink flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-t border-white/[0.06]">
          <div className="font-serif text-[1rem] lg:text-[1.1rem] text-dawn">
            Marcelo Firpo
          </div>
          <div className="text-[1rem] text-mist opacity-50">
            © {new Date().getFullYear()} Marcelo Firpo
          </div>
        </footer>
      </Scaffold>
    </>
  );
};

export default Collection;
