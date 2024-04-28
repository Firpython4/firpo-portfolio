import Image from "next/image";
import Link from "next/link";
import { emailLink, linkedInLink } from "../config";

export const NavBar = () =>
{
    return <div className="flex flex-row space-x-[26px]">
        <Link href={emailLink}>
            <Image alt="email" src="/icons/hero-icons/email-icon.svg" width={38.48} height={34.2}/>
        </Link>
        <Link href={linkedInLink}>
            <Image alt="LinkedIn" src="/icons/hero-icons/linkedin-icon.svg" width={34.21} height={34.21}/>
        </Link>
    </div>;
};