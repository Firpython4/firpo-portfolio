import Image from "next/image";
import { useBreakpoint } from "../hooks/tailwind";

export const NavBar = () =>
{
    return <div className="absolute left-[73.28%] top-[13.61%] flex flex-row space-x-[26px]">
        <Image alt="email" src="/icons/hero-icons/email-icon.svg" width={38.48} height={34.2}/>
        <Image alt="LinkedIn" src="/icons/hero-icons/linkedin-icon.svg" width={34.21} height={34.21}/>
    </div>;
};