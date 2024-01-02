import Image from "next/image";
import background from "../../public/firpo-color.png";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";
import {locale} from "~/localization/localization";
import {type PropsWithChildren} from "react";

const HeroTitle = () =>
(
    <h2 className="shrink-0
                   text-white
                   text-large
                   not-italic
                   font-semibold
                   leading-[20px]
                   mobile_sm:leading-[25px]
                   mobile_md:leading-[30px]
                   mobile_lg:leading-[40px]
                   sm:leading-[50px]
                   md:leading-[60px]
                   lg:leading-[80px]
                   xl:leading-[98px]
                   tracking-[-2px]
                   mobile_lg:tracking-[-3.745px]
                   font-hepta_slab">
        {locale.name}
    </h2>
);

const HeroSubtitle = () =>
(
    <h3 className="w-[120px]
                   mobile_md:w-[160px]
                   mobile_lg:w-[200px]
                   sm:w-[280px]
                   md:w-[300px]
                   lg:w-[400px]
                   xl:w-[500px]
                   text-white
                   text-medium
                   not-italic
                   font-bold
                   leading-[14px]
                   mobile_sm:leading-[16px]
                   mobile_md:leading-[20px]
                   mobile_lg:leading-[25px]
                   sm:leading-[30px]
                   md:leading-[40px]
                   lg:leading-[50px]
                   font-hepta_slab">
        {locale.subtitle}
    </h3>
);

const HeroText = (props: {className?: string}) =>
(
    <div className={`flex
        flex-col
        gap-y-2
        mobile_lg:gap-y-3
        sm:gap-y-4
        md:gap-y-6
        lg:gap-y-8
        xl:gap-y-10
        ${props.className}`}>
        <HeroTitle/>
        <HeroSubtitle/>
    </div>
);

const HeroBackground = (props: PropsWithChildren<{className?: string}>) =>
(
    <div className={props.className}>
        <Image width={5760} height={2799} src={background.src} alt="Marcelo Firpo"/>
        {props.children}
    </div>
);

const HeroContent = () =>
(
    <>
        <HeroText className="absolute
                             w-[23%]
                             right-[21%]
                             top-[5%]
                             mobile_lg:top-[8%]
                             sm:top-[16%]
                             md:top-[18%]
                             lg:top-[20%]
                             xl:top-[27.22%]"/>
        <NavBar className="absolute
                           right-[0%]
                           max-mobile_lg:left-[5%]
                           mobile_lg:right-[5%]
                           sm:right-[14%]
                           md:right-[16%]
                           lg:right-[18%]
                           xl:right-[21.56%]
                           top-[3%]
                           sm:top-[5%]
                           md:top-[6%]
                           lg:top-[10%]
                           xl:top-[13.61%]"/>
    </>
);

export const Hero = () =>
(
    <VerticalCenterBox className="w-responsive max-h-responsive-screen overflow-hidden">
        <HeroBackground className="relative top-[-2%] lg:top-[-11%]">
            <HeroContent/>
        </HeroBackground>
    </VerticalCenterBox>
);
