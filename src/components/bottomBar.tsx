import { NavBar } from "~/components/navBar";
import { type PropsWithLocalizedCopy } from "../types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

const responsiveText = "text-sm md:text-md lg:text-lg xl:text-xl";

export const BottomBar = (
  props: PropsWithClassName<PropsWithLocalizedCopy>,
) => (
  <div
    className={`${props.className} flex flex-col items-center justify-center gap-y-[11px] md:flex-row md:gap-x-[11px]`}
  >
    <p
      className={`flex items-center text-center text-lg text-black xl:w-[412px] ${responsiveText} font-inter font-semibold leading-normal`}
    >
      {props.localizedCopy.home.callToAction.solveYourCommunicationProblems}
    </p>
    <NavBar
      iconPaths={{
        email: "/icons/email-icon.svg",
        linkedin: "/icons/linkedin-icon.svg",
      }}
    />
  </div>
);
