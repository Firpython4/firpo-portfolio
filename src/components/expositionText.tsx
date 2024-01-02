import { locale } from "~/localization/localization";

export const ExpositionText = (props: {className?: string}) =>
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
        <div
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
                        font-inter`}>{locale.expositionFirst}
        </div>
        <div className="w-[435px]
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
                             pt-3">{locale.someAttendedClients}<br/></span>
            <span className="text-black
                             text-small
                             font-normal">{locale.clients}</span>
        </div>
    </div>
);
