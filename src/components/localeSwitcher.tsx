"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "~/types/propsWithClassName";

export function LocaleSwitcher({className, locale}: PropsWithClassName<{locale: Locale}>) {
  const pathname = usePathname()
  const router = useRouter();
 
  function switchLocale(newLocale: Locale) {
    const newPath = pathname.replace(locale, newLocale)
    router.replace(newPath, {scroll: false})
  }
 
  return (
    <>
      <button className={`${className} mix-blend-exclusion text-white tracking-wide font-inter text-lg`} onClick={() => switchLocale(locale === "en" ? "pt" : "en")}>{locale === "pt" ? "English" : "Português"}</button>
    </>
  )
}
