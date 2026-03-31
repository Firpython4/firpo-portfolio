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
      <LocaleSwitcher className="text-black absolute top-4 right-4 md:top-8 md:right-8 lg:right-12 lg:top-12 iconify-color" locale={locale}/>
    </>
  );
};

export default RootLayout;

