import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";
import Image from "next/image";

export const emailIconSize = `w-[14px]
                            h-[14px]
                            mobile_sm:w-[16px]
                            mobile_sm:h-[16px]
                            mobile_md:w-[14px]
                            mobile_md:h-[14px]
                            mobile_lg:w-[18px]
                            mobile_lg:h-[18px]
                            sm:w-[20px]
                            sm:h-[20px]
                            md:w-[26px]
                            md:h-[26px]
                            lg:w-[30px]
                            lg:h-[30px]
                            xl:w-[34px]
                            xl:h-[34px]`

export const linkedinIconSize = `w-[14px]
                            h-[14px]
                            mobile_sm:w-[16px]
                            mobile_sm:h-[16px]
                            mobile_md:w-[14px]
                            mobile_md:h-[14px]
                            mobile_lg:w-[18px]
                            mobile_lg:h-[18px]
                            sm:w-[20px]
                            sm:h-[20px]
                            md:w-[26px]
                            md:h-[26px]
                            lg:w-[30px]
                            lg:h-[30px]
                            xl:w-[34px]
                            xl:h-[34px]`

export const NavBar = (props: {className?: string, iconPaths: {linkedin: string, email: string}}) =>
{
    return (
        <div className={`${props.className} flex flex-row gap-x-[8px] sm:gap-x-[12px] md:gap-x-[18px] lg:gap-x-[22px] xl:gap-x-[26px]`}>
            <div className={`relative ${emailIconSize}`}>
                <Link href={emailLink}>
                    <Image alt="email" src={props.iconPaths.email} fill={true}/>
                </Link>
            </div>
            <div className={`relative ${linkedinIconSize}`}>
            <Link href={linkedInLink}>
                <Image alt="LinkedIn" src={props.iconPaths.linkedin} fill={true}/>
            </Link>
            </div>
        </div>
    );
};