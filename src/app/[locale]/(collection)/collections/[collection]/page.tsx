import { type Metadata } from "next";

import ExportedImage from "next-image-export-optimizer";

import { VerticalCenterBox } from "~/components/verticalCenterBox";

import {
  getCollectionPageContent,
  getCollectionsStaticPaths,
} from "~/collection";

import LinkWithLocale from "~/components/LinkWithLocale";

import { type Locale } from "~/localization/localization";

import { type CollectionPageParams } from "~/types/params";

import commonMetadata from "../../../../../metadata";

import type PropsWithClassName from "../../../../../types/propsWithClassName";

import { replaceNewlines } from "~/cms/cmsCompiler";

import { orderByConfig, pieceNameProvider } from "~/cms/ordering";
import Scaffold from "~/components/scaffold";
import { CollectionPieces } from "~/components/collectionPieces";

export const generateStaticParams = async () => {
  return await getCollectionsStaticPaths();
};

type PageParams = CollectionPageParams;

export const generateMetadata = async (props: { params: PageParams }) => {
  const pageContent = await getCollectionPageContent(props.params);

  const metadata: Metadata = {
    ...commonMetadata,

    title: `Marcelo Firpo - ${pageContent.content.parsed.matters.title}`,

    description: pageContent.content.parsed.matters.meta,
  };

  return metadata;
};

const BackIcon = (props: PropsWithClassName) => (
  <ExportedImage
    className={props.className}
    alt="home"
    src="/icons/back-icon.svg"
    width={31}
    height={31}
    sizes="31px"
  />
);

const BackButton = (props: { locale: Locale; collectionName: string }) => {
  return (
    <div className="aspect-square w-[31px]">
      <LinkWithLocale href={`/#${props.collectionName}`} locale={props.locale}>
        <BackIcon />
      </LinkWithLocale>
    </div>
  );
};

const Collection = async (props: { params: PageParams }) => {
  const pageContent = await getCollectionPageContent(props.params);

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

  return (
    <Scaffold>
      <div
        className="
        pl-[40px]
        pt-[44px]
        w-full
        sm:pl-[50px]
        md:pl-[100px]
        lg:pl-[150px]
        xl:pl-[411px]"
      >
        <BackButton
          locale={pageContent.locale}
          collectionName={props.params.collection}
        />
      </div>

      <VerticalCenterBox className="gap-y-[16px] pt-[88px]">
        <h2 className="px-[30px] text-center font-display text-2xl font-extrabold text-neutral-700">
          {replaceNewlines(pageContent.content.parsed.matters.title)}
        </h2>

        <div
          className="whitespace-pre-wrap px-12 pt-10 font-display text-[17px] text-lg text-neutral-700 sm:px-20 md:px-32 xl:px-96"
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        ></div>
      </VerticalCenterBox>

      <VerticalCenterBox className="gap-y-[30px]">
        <VerticalCenterBox
          className="gap-y-[32px]
                    pb-[80px]
                    pt-20
                    sm:gap-y-[96px]
                    sm:pb-[156px]
                    md:gap-y-[128px]
                    lg:gap-y-[128px]
                    xl:gap-y-[128px]
                    "
        >
          <CollectionPieces
            gap={80}
            pieces={[
              pageContent.thumbnail,
              ...(pageContent.piecesWithoutThumbnail ?? []),
            ]}
          />
        </VerticalCenterBox>

        <div
          className="pb-[74px]
                    pl-[40px]
                    w-full
                    sm:pl-[50px]
                    md:pl-[100px]
                    lg:pl-[150px]
                    xl:pl-[411px]"
        >
          <BackButton
            locale={pageContent.locale}
            collectionName={props.params.collection}
          />
        </div>
      </VerticalCenterBox>
    </Scaffold>
  );
};

export default Collection;
