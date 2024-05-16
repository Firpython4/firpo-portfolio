"use client";

import { type CSSProperties } from "react";
import { type YouTubeConfig } from "react-player/youtube";
import type PropsWithClassName from "../types/propsWithClassName";

import dynamic from "next/dynamic";

const YoutubeReactPlayerComponent = dynamic(
  () => import("react-player/youtube"),
  { ssr: false },
);
const VimeoReactPlayerComponent = dynamic(() => import("react-player/vimeo"), {
  ssr: false,
});

export const PieceVideo = (
  props: PropsWithClassName<{
    url: string;
    playing: boolean;
    muted: boolean;
    controls: boolean;
    style?: CSSProperties;
    width?: number;
    height?: number;
    youtubeConfig: YouTubeConfig;
  }>,
) => {
  if (props.url.includes("youtube")) {
    return (
      <div style={props.style} className={props.className}>
        <YoutubeReactPlayerComponent
          width="100%"
          height="100%"
          url={props.url}
          controls={props.controls}
          muted={props.muted}
          loop={true}
          playing={props.playing}
          config={props.youtubeConfig}
        />
      </div>
    );
  } else if (props.url.includes("vimeo")) {
    return (
      <div style={props.style} className={props.className}>
        <VimeoReactPlayerComponent
          width="100%"
          height="100%"
          url={props.url}
          controls={props.controls}
          muted={props.muted}
          loop={true}
          playing={props.playing}
        />
      </div>
    );
  }

  throw new Error(`Unsupported video provider: ${props.url}`);
};
