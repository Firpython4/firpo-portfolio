import { locale } from "~/localization/localization";

export const ExpositionText = (props: {className?: string}) =>
(
    <div
        className={`${props.className} w-full flex flex-col lg:flex-row justify-center max-lg:items-center gap-[40px] md:gap-[20px] lg:gap-[130px] xl:gap-[215px]`}>
        <div
            className={`w-[434px] text-black text-small not-italic font-semibold leading-[27px] font-inter`}>{locale.expositionFirst}
        </div>
        <div className="w-[435px] text-black text-small not-italic font-normal leading-[27px] tracking-[-0.17px] pt-[172px] font-inter">
            <span className="text-black text-small font-semibold leading-relaxed pt-3">{locale.someAttendedClients}<br/></span>
            <span className="text-black text-small font-normal leading-relaxed">{locale.clients}</span>
        </div>
    </div>
);
