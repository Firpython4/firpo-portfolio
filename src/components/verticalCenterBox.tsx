import { type PropsWithChildren } from "react";

export const VerticalCenterBox = (props: PropsWithChildren<{className?: string}>) => <div className={`w-full flex flex-col items-center ${props.className}`}>
    {props.children}
</div>;