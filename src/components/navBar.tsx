import Image from "next/image";
import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";

export const NavBar = () =>
{
    return <div className="flex flex-row space-x-[26px]">
        <div className="lg:w-[34px] lg:h-[30px] xl:w-[38px] xl:h-[34px]">
            <Link href={emailLink}>
                <Image alt="email" src="/icons/hero-icons/email-icon.svg" layout="fill"/>
            </Link>
        </div>
        <div className="lg:w-[34px] lg:h-[30px] xl:w-[38px] xl:h-[34px]">
        <Link href={linkedInLink}>
            <Image alt="LinkedIn" src="/icons/hero-icons/linkedin-icon.svg" width={34.21} height={34.21}/>
        </Link>
        </div>
    </div>;
};