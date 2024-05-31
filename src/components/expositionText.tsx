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
      className="sm:max-w-[434px]
                max-sm:max-w-[80%]
                font-inter
                text-[17px]
                leading-[27px]
                text-black
                font-semibold"
    >
      {props.localizedCopy.home.about.expositionFirst}
    </p>
    <p
      className="sm:max-w-[435px]
                        font-inter
                        text-[17px]
                        font-normal
                        not-italic
                        leading-[27px]
                        tracking-[-0.17px]
                        text-black
                        max-sm:max-w-[80%]
                        lg:pt-[172px]"
    >
      <span
        className="pt-3
                             font-semibold
                             text-black"
      >
        {props.localizedCopy.home.about.someAttendedClients}
        <br />
      </span>
      <span
        className="font-normal text-black"
      >
        {props.localizedCopy.home.about.clients}
      </span>
    </p>
  </div>
);
