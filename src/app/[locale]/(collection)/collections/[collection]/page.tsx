import { type Metadata } from "next";

import ExportedImage from "next-image-export-optimizer";

import { VerticalCenterBox } from "~/components/verticalCenterBox";

import type { YouTubeConfig } from "react-player/youtube";

import {
  getCollectionPageContent,
  getCollectionsStaticPaths,
} from "~/collection";

import LinkWithLocale from "~/components/LinkWithLocale";

import { PieceVideo } from "~/components/PieceVideo";

import { type Locale } from "~/localization/localization";

import { type CollectionPageParams } from "~/types/params";

import commonMetadata from "../../../../../metadata";

import { getContainedByAspectRatioStyle } from "../../../../../styles/styleUtilities";

import type PropsWithClassName from "../../../../../types/propsWithClassName";

import { replaceNewlines } from "~/cms/cmsCompiler";

import { getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";
import { orderByConfig, pieceNameProvider } from "~/cms/ordering";
import Scaffold from "~/components/scaffold";

export const generateStaticParams = async () => {
  return await getCollectionsStaticPaths();
};

type PageParams = CollectionPageParams;

export const generateMetadata = async (props: { params: PageParams }) => {
  const pageContent = await getCollectionPageContent(props.params);

  const metadata: Metadata = {
    ...commonMetadata,

    title: `Marcelo Firpo - ${pageContent.content.parsed.matters.title}`,

    description: pageContent.content.parsed.asString,
  };

  return metadata;
};

const Piece = (props: PropsWithClassName<{ piece: PieceType }>) => {
  const piece = props.piece;

  if (piece.option === 2) {
    const style = getContainedByAspectRatioStyle(
      "90vw",
      "90svh",
      piece.value.width,
      piece.value.height,
    );

    return (
      <ExportedImage
        key={piece.value.url}
        style={style}
        className={`${props.className}

                aspect-[${piece.value.width}/${piece.value.height}]`}
        src={piece.value.url}
        width={piece.value.width}
        height={piece.value.height}
        alt={piece.value.name}
        sizes={`${piece.value.width.toString()}px`}
      />
    );
  } else {
    const youTubeConfig: YouTubeConfig = {
      playerVars: {
        controls: 1,

        disablekb: 0,

        modestbranding: 1,

        showinfo: 1,
      },
    };

    const style = getContainedByAspectRatioStyle("90vw", "90svh", 16, 9);

    const url = getUrlFromPiece(piece);

    return (
      <PieceVideo
        className={props.className}
        style={style}
        playing={false}
        url={url}
        youtubeConfig={youTubeConfig}
        muted={false}
        controls={true}
      />
    );
  }
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
        w-responsive-screen
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
        <h2 className="px-[30px] text-center font-inter text-2xl font-extrabold text-neutral-700">
          {replaceNewlines(pageContent.content.parsed.matters.title)}
        </h2>

        <div
          className="px-12 sm:px-20 md:px-32 xl:px-96 pt-10 whitespace-pre-wrap font-inter text-lg text-[17px] text-neutral-700"
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
          {[
            pageContent.thumbnail,
            ...(pageContent.piecesWithoutThumbnail ?? []),
          ].map((piece) => (
            <Piece piece={piece} key={getUrlFromPiece(piece)} />
          ))}
        </VerticalCenterBox>

        <div
          className="pb-[74px]
                    pl-[40px]
                    w-responsive-screen
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
