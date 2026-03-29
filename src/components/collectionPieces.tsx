"use client";

import { type YouTubeConfig } from "react-player/youtube";
import ExportedImage from "next-image-export-optimizer";
import { PieceVideo } from "./PieceVideo";
import { getUrlFromPiece, type PieceType } from "~/cms/schemaTypes";
import { getContainedByAspectRatioStyle } from "~/styles/styleUtilities";
import type PropsWithClassName from "~/types/propsWithClassName";
import { VirtualList } from "./virtualList";

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
        className={`${props.className} aspect-[${piece.value.width}/${piece.value.height}]`}
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

export const CollectionPieces = (props: { pieces: PieceType[] }) => {
  return (
    <VirtualList
      items={props.pieces}
      estimateSize={500}
      overscan={3}
      className="w-full"
      renderItem={(piece, _index) => (
        <Piece piece={piece} key={getUrlFromPiece(piece)} />
      )}
    />
  );
};
