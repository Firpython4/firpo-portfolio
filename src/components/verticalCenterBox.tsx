import { type PropsWithChildren } from "react";
import type PropsWithClassName from "../types/propsWithClassName";

export const VerticalCenterBox = (
  props: PropsWithClassName<PropsWithChildren>,
) => (
  <div
    className={`${props.className} flex w-full flex-col items-center ${props.className}`}
  >
    {props.children}
  </div>
);
