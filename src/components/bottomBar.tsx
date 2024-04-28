import {NavBar} from "~/components/navBar";
import { type LocalizedTextsProps } from "../types/misc";

const responsiveText = "text-sm md:text-md lg:text-lg xl:text-xl"

export const BottomBar = (props: {className?: string} & LocalizedTextsProps) =>
(
    <div
        className={`${props.className} flex flex-col gap-y-[11px] items-center justify-center md:flex-row md:gap-x-[11px]`}>
        <p className={`xl:w-[412px] text-black text-center flex items-center text-lg ${responsiveText} font-semibold font-inter leading-normal`}>
            {props.localizedTexts.solveYourCommunicationProblems}
        </p>
        <NavBar iconPaths={{email: "/icons/email-icon.svg", linkedin: "/icons/linkedin-icon.svg"}}/>
    </div>
);
