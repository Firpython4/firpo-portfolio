import { type PropsWithChildren } from "react";
import type PropsWithClassName from "../types/propsWithClassName";

export const VerticalCenterBox = (props: PropsWithClassName<PropsWithChildren>) => (
    <div className={`${props.className} w-full flex flex-col items-center ${props.className}`}>
        {props.children}
    </div>
);