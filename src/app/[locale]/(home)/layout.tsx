import { type PropsWithChildren, use } from "react";
import { LocaleSwitcher } from "~/components/localeSwitcher";
import { type Locale } from "~/localization/localization";

const RootLayout = (
  props: PropsWithChildren<{ params: Promise<{ locale: string }> }>,
) => {
  const params = use(props.params);
  const locale = params.locale as Locale;
  
  return (
    <>
      {props.children}
      <LocaleSwitcher
        className="absolute right-[clamp(70px,18vw,180px)] top-4 pt-1 font-body text-base tracking-wide text-white max-[200px]:hidden md:top-6 lg:top-12"
        locale={locale}
      />
    </>
  );
};

export default RootLayout;
