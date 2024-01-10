import ExportedImage from "next-image-export-optimizer";
import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";

const iconImageSizes = `14px,
                            screen(mobile_sm) 16px,
                            screen(mobile_md) 14px,
                            screen(mobile_lg) 18px,
                            screen(sm) 20px,
                            screen(md) 26px,
                            screen(lg) 30px,
                            screen(xl) 34px`;

export const linkedIconSize = `w-[14px]
                            mobile_sm:w-[16px]
                            mobile_md:w-[14px]
                            mobile_lg:w-[18px]
                            sm:w-[20px]
                            md:w-[26px]
                            lg:w-[30px]
                            xl:w-[34px]
                            `

export const emailIconSize = `h-[14px]
                            mobile_sm:h-[16px]
                            mobile_md:h-[14px]
                            mobile_lg:h-[18px]
                            sm:h-[20px]
                            md:h-[26px]
                            lg:h-[30px]
                            xl:h-[34px]`

export const NavBar = (props: {className?: string, iconPaths: {linkedin: string, email: string}}) =>
{
    return (
        <div className={`${props.className} flex flex-row gap-x-[8px] sm:gap-x-[12px] md:gap-x-[18px] lg:gap-x-[22px] xl:gap-x-[26px]`}>
            <Link href={emailLink}>
                <ExportedImage alt="email" className={`aspect-[39/34] ${emailIconSize}`} src={props.iconPaths.email} width={39} height={34} sizes={iconImageSizes}/>
            </Link>
            <Link href={linkedInLink}>
                <ExportedImage alt="LinkedIn" className={`aspect-square ${linkedIconSize}`} src={props.iconPaths.linkedin} width={34} height={34} sizes={iconImageSizes}/>
            </Link>
        </div>
    );
};