import type { PropsWithChildren } from "react";

const Scaffold = (props: PropsWithChildren) => (
  <main className="flex min-h-screen flex-col">
    {props.children}
  </main>
);

export default Scaffold;
