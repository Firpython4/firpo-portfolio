import type { PropsWithChildren } from "react";
import { VerticalCenterBox } from "./verticalCenterBox";
const Scaffold = (props: PropsWithChildren) => (
  <main
    className={`flex flex-col justify-center overflow-hidden bg-white`}
  >
    <VerticalCenterBox>{props.children}</VerticalCenterBox>
  </main>
);

export default Scaffold;
