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
                gap-x-[clamp(20px,5vw,215px)]
                gap-y-[clamp(30px,10vw,150px)]
                max-lg:items-center
                lg:flex-row`}
  >
    <p
      className="max-w-[clamp(80%,90%,434px)]
                font-inter
                text-[17px]
                leading-[27px]
                text-black
                font-semibold"
    >
      {props.localizedCopy.home.about.expositionFirst}
    </p>
    <p
      className="max-w-[clamp(80%,90%,435px)]
                font-inter
                text-[17px]
                font-normal
                not-italic
                leading-[27px]
                tracking-[-0.17px]
                text-black
                lg:pt-[clamp(100px,15vw,172px)]"
    >
      <span className="font-semibold text-black">
        {props.localizedCopy.home.about.someAttendedClients}
        <br />
      </span>
      <span className="font-normal text-black">
        {props.localizedCopy.home.about.clients}
      </span>
    </p>
  </div>
);
