import type { PropsWithChildren } from "react";

const Scaffold = (props: PropsWithChildren) => (
  <main className="flex min-h-screen flex-col pt-16 lg:pt-20">
    {props.children}
  </main>
);

export default Scaffold;
