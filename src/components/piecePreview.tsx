"use client";

import ExportedImage from "next-image-export-optimizer";

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
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
      className="group relative block overflow-hidden bg-surface shadow-sm transition-all duration-300 hover:shadow-lg"
      href={props.url}
      ref={ref}
      locale={props.locale}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        bg-charcoal/80
                        opacity-0
                        backdrop-blur-[2px]
                        transition-opacity
                        duration-300
                        group-hover:opacity-100"
        >
          <span className="px-6 py-4 font-hepta_slab text-[clamp(0.75rem,2vw,1.25rem)] font-semibold text-white">
            {props.collectionName}
          </span>
        </div>
        {props.children}
      </div>
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
  const [shouldPlay, setShouldPlay] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovering) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShouldPlay(true), 150);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShouldPlay(false), 300);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovering]);

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
        shouldPlay={shouldPlay}
        collectionId={props.collectionName}
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
  props: PropsWithClassName<{
    piece: PieceType;
    shouldPlay: boolean;
    collectionId: string;
  }>,
) => {
  const piece = props.piece;
  const url = getUrlFromPiece(piece);
  if (piece.option === 2) {
    return (
      <ExportedImage
        id={props.collectionId}
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
        rel: 0,
        iv_load_policy: 3,
        cc_load_policy: 0,
        fs: 0,
        playsinline: 1,
      },
      embedOptions: {
        hideFullscreenButton: true,
      },
    };

    if (piece.option === 0) {
      const thumbnail = getThumbnail(url);
      if (thumbnail) {
        return (
          <>
            <ExportedImage
              id={props.collectionId}
              src={thumbnail}
              alt={piece.value.name}
              fill={true}
              sizes={pieceThumbnailSizes}
              className={`${props.className}
                                  absolute
                                  z-20
                                  object-cover
                                  opacity-100
                                  transition-opacity
                                  delay-[250ms]
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
          id={props.collectionId}
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
            id={props.collectionId}
            width={piece.value.thumbnail.width}
            height={piece.value.thumbnail.height}
            src={piece.value.thumbnail.url}
            alt={piece.value.url.name}
            sizes={pieceThumbnailSizes}
            className={`${props.className}
                              absolute
                              z-20
                              object-cover
                              opacity-100
                              transition-opacity
                              delay-[250ms]
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
            hideOverlay={true}
          />
        </>
      );
    }
  }
};
