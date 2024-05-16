"use client";

import ExportedImage from "next-image-export-optimizer";

import { forwardRef, useRef, type PropsWithChildren } from "react";
import { type YouTubeConfig } from "react-player/youtube";
import { useHover } from "usehooks-ts";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";
import LinkWithLocale from "./LinkWithLocale";
import { PieceVideo } from "./PieceVideo";
import { getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";

type HoverablePieceProps = PropsWithChildren<{
  url: string;
  locale: Locale;
  collectionName: string;
}>;

const HoverablePiecePreview = forwardRef<
  HTMLAnchorElement,
  HoverablePieceProps
>((props: HoverablePieceProps, ref) => {
  return (
    <LinkWithLocale
      className="group relative flex aspect-[364/205] max-h-[205px] max-w-[364px] items-center overflow-hidden"
      href={props.url}
      ref={ref}
      locale={props.locale}
    >
      <div
        className="absolute
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center whitespace-pre-wrap
                            bg-black/70
                            p-6
                            text-center
                            font-inter
                            text-[12px]
                            font-medium
                            text-white
                            opacity-0
                            transition-opacity
                            duration-150
                            ease-in
                            group-hover:opacity-100
                            mobile_md:text-[22px]
                            sm:text-[24px]"
      >
        {props.collectionName}
      </div>
      {props.children}
    </LinkWithLocale>
  );
});

export const PiecePreview = (props: {
  piece: PieceType;
  locale: Locale;
  collectionName: string;
  collectionPrettyName: string;
}) => {
  const piece = props.piece;
  const ref = useRef<HTMLAnchorElement>(null);
  const isHovering = useHover(ref);
  return (
    <HoverablePiecePreview
      locale={props.locale}
      url={`/collections/${props.collectionName}`}
      collectionName={props.collectionPrettyName}
      ref={ref}
    >
      <PieceThumbnail
        className="h-full w-full"
        piece={piece}
        shouldPlay={isHovering}
      />
    </HoverablePiecePreview>
  );
};

const maxresdefault = "maxresdefault";
const sddefault = "sddefault";
const mqdefault = "mqdefault";
const hqdefault = "hqdefault";

const qualityTypes = [maxresdefault, sddefault, mqdefault, hqdefault] as const;

type QualityType = (typeof qualityTypes)[number];

function getThumbnail(url: string, quality?: string) {
  if (url) {
    let video_id = undefined;
    let result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/);
    if (result) {
      video_id = result.pop();
    } else {
      result = url.match(/youtu.be\/(.{11})/);
      if (result) {
        video_id = result.pop();
      }
    }

    if (video_id) {
      if (quality === undefined) {
        quality = "high";
      }

      let quality_key: QualityType = "maxresdefault";
      if (quality == "low") {
        quality_key = sddefault;
      } else if (quality == "medium") {
        quality_key = mqdefault;
      } else if (quality == "high") {
        quality_key = hqdefault;
      }

      return `https://img.youtube.com/vi/${video_id}/${quality_key}.jpg`;
    }
  }
}

const pieceThumbnailSizes = `100svw, screen(mobile_lg) 364px`;

const PieceThumbnail = (
  props: PropsWithClassName<{ piece: PieceType; shouldPlay: boolean }>,
) => {
  const piece = props.piece;
  const url = getUrlFromPiece(piece);
  if (piece.option === 2) {
    return (
      <ExportedImage
        className={`aspect-[${piece.value.width}/${piece.value.height}] object-cover ${props.className}`}
        width={piece.value.width}
        height={piece.value.height}
        src={url}
        alt={piece.value.name}
        sizes={pieceThumbnailSizes}
      />
    );
  } else {
    const youTubeConfig: YouTubeConfig = {
      playerVars: {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        showinfo: 0,
      },
    };

    if (piece.option === 0) {
      const thumbnail = getThumbnail(url);
      if (thumbnail) {
        return (
          <>
            <ExportedImage
              src={thumbnail}
              alt={piece.value.name}
              fill={true}
              sizes={pieceThumbnailSizes}
              unoptimized={true}
              className={`${props.className}
                                  absolute
                                  object-cover
                                  opacity-100
                                  transition-opacity
                                  duration-300
                                  ease-in-out
                                  group-hover:opacity-0`}
            />
            <PieceVideo
              className={props.className}
              url={url}
              playing={props.shouldPlay}
              width={364}
              height={205}
              youtubeConfig={youTubeConfig}
              muted={true}
              controls={false}
            />
          </>
        );
      }

      return (
        <PieceVideo
          className={props.className}
          url={url}
          playing={props.shouldPlay}
          width={364}
          height={205}
          youtubeConfig={youTubeConfig}
          muted={true}
          controls={false}
        />
      );
    } else {
      return (
        <>
          <ExportedImage
            width={piece.value.thumbnail.width}
            height={piece.value.thumbnail.height}
            src={piece.value.thumbnail.url}
            alt={piece.value.url.name}
            sizes={pieceThumbnailSizes}
            className={`${props.className}
                              absolute
                              object-cover
                              opacity-100
                              transition-opacity
                              duration-300
                              ease-in-out
                              group-hover:opacity-0`}
          />
          <PieceVideo
            className={props.className}
            url={url}
            playing={props.shouldPlay}
            width={364}
            height={205}
            youtubeConfig={youTubeConfig}
            muted={true}
            controls={false}
          />
        </>
      );
    }
  }
};
