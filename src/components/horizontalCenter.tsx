import { type PropsWithChildren } from "react";

export const HorizontalCenter = (props: PropsWithChildren) => <div className="w-screen flex justify-center">
    {props.children}
</div>;