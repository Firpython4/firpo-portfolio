import { type Locale } from "~/localization/localization";
import { type PropsWithLocalizedCopy } from "~/types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

export const ExpositionText = (
  props: PropsWithClassName<{ locale: Locale } & PropsWithLocalizedCopy>,
) => (
  <div
    className={`${props.className}
                    flex
                    w-full
                    flex-col
                    justify-center
                    gap-x-[30px]
                    gap-y-[30px]
                    max-lg:items-center
                    sm:gap-x-[40px]
                    sm:gap-y-[40px]
                    md:gap-x-[20px]
                    md:gap-y-[100px]
                    lg:flex-row
                    lg:gap-x-[130px]
                    lg:gap-y-[140px]
                    xl:gap-x-[215px]
                    xl:gap-y-[150px]`}
  >
    <p
      className={`w-[434px]
                        font-inter
                        text-small
                        font-semibold
                        not-italic
                        leading-[14px]
                        text-black
                        max-sm:max-w-[80%]
                        md:leading-[18px]
                        lg:leading-[22px]
                        xl:leading-[27px]`}
    >
      {props.localizedCopy.home.about.expositionFirst}
    </p>
    <p
      className="w-[435px]
                        font-inter
                        text-small
                        font-normal
                        not-italic
                        leading-[14px]
                        tracking-[-0.17px]
                        text-black
                        max-sm:max-w-[80%]
                        md:leading-[18px]
                        lg:pt-[172px]
                        lg:leading-[22px]
                        xl:leading-[27px]"
    >
      <span
        className="pt-3
                             text-small
                             font-semibold
                             text-black"
      >
        {props.localizedCopy.home.about.someAttendedClients}
        <br />
      </span>
      <span
        className="text-small
                             font-normal
                             text-black"
      >
        {props.localizedCopy.home.about.clients}
      </span>
    </p>
  </div>
);
