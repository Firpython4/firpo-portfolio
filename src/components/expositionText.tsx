import { type Locale  } from "~/localization/localization";
import { type LocalizedTextsProps } from "../types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

export const ExpositionText = (props: PropsWithClassName<{locale: Locale} & LocalizedTextsProps>) =>
(
    <div
        className={`${props.className}
                    w-full
                    flex
                    flex-col
                    lg:flex-row
                    justify-center
                    max-lg:items-center
                    gap-y-[30px]
                    sm:gap-y-[40px]
                    md:gap-y-[100px]
                    lg:gap-y-[140px]
                    xl:gap-y-[150px]
                    gap-x-[30px]
                    sm:gap-x-[40px]
                    md:gap-x-[20px]
                    lg:gap-x-[130px]
                    xl:gap-x-[215px]`}>
        <p
            className={`w-[434px]
                        text-black
                        text-small
                        not-italic
                        font-semibold
                        max-sm:max-w-[80%]
                        leading-[14px]
                        md:leading-[18px]
                        lg:leading-[22px]
                        xl:leading-[27px]
                        font-inter`}>{props.localizedTexts.expositionFirst}
        </p>
        <p className="w-[435px]
                        text-black
                        text-small
                        not-italic
                        font-normal
                        max-sm:max-w-[80%]
                        tracking-[-0.17px]
                        leading-[14px]
                        md:leading-[18px]
                        lg:leading-[22px]
                        xl:leading-[27px]
                        lg:pt-[172px]
                        font-inter">
            <span className="text-black
                             text-small
                             font-semibold
                             pt-3">{props.localizedTexts.someAttendedClients}<br/></span>
            <span className="text-black
                             text-small
                             font-normal">{props.localizedTexts.clients}</span>
        </p>
    </div>
);
