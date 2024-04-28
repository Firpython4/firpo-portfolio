import Image from "next/image"
import Link from "next/link";
import { emailLink, linkedInLink } from "~/config";
import {locale} from "~/localization/localization";

export const BottomBar = (props: {className?: string}) =>
(
    <div
        className={`${props.className} flex flex-col gap-y-[11px] items-center justify-center md:flex-row md:gap-x-[11px]`}>
        <p className={`w-[412px] text-black flex items-center text-xl font-semibold font-inter leading-normal`}>
            {locale.solveYourCommunicationProblems}
        </p>
        <div className="m-0 flex flex-row gap-x-[26px]">
            <Link href={emailLink}>
                <Image alt="email" src="/icons/email-icon.svg" width={38} height={34}/>
            </Link>
            <Link href={linkedInLink}>
                <Image alt="LinkedIn" src="/icons/linkedin-icon.svg" width={34} height={34}/>
            </Link>
        </div>
    </div>
);
