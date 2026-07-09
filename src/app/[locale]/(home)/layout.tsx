import { type PropsWithChildren } from "react";

const RootLayout = (
  props: PropsWithChildren,
) => {
  return (
    <>
      {props.children}
    </>
  );
};

export default RootLayout;
