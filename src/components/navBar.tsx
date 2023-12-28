import Image from "next/image";
import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";

export const NavBar = () =>
{
    return (
        <div className="flex flex-row space-x-[26px]">
            <div className="relative lg:w-[34px] lg:h-[30px] xl:w-[38px] xl:h-[34px]">
                <Link href={emailLink}>
                    <Image alt="email" src="/icons/hero-icons/email-icon.svg" fill={true}/>
                </Link>
            </div>
            <div className="relative lg:w-[34px] lg:h-[34px] xl:w-[34px] xl:h-[34px]">
            <Link href={linkedInLink}>
                <Image alt="LinkedIn" src="/icons/hero-icons/linkedin-icon.svg" fill={true}/>
            </Link>
            </div>
        </div>
    );
};