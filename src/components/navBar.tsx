import Image from "next/image";
import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";

export const NavBar = (props: {className?: string}) =>
{
    return (
        <div className={`${props.className} flex flex-row gap-x-[8px] sm:gap-x-[12px] md:gap-x-[18px] lg:gap-x-[22px] xl:gap-x-[26px]`}>
            <div className="relative w-[20px] h-[ sm:w-[26px] sm:h-[23px] md:w-[30px] md:h-[26px] lg:w-[34px] lg:h-[30px] xl:w-[38px] xl:h-[34px]">
                <Link href={emailLink}>
                    <Image alt="email" src="/icons/hero-icons/email-icon.svg" fill={true}/>
                </Link>
            </div>
            <div className="relative w-[20px] h-[17px] sm:w-[24px] sm:h-[24px] md:w-[30px] md:h-[30px] lg:w-[34px] lg:h-[34px] xl:w-[34px] xl:h-[34px]">
            <Link href={linkedInLink}>
                <Image alt="LinkedIn" src="/icons/hero-icons/linkedin-icon.svg" fill={true}/>
            </Link>
            </div>
        </div>
    );
};