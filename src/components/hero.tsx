import ExportedImage from "next-image-export-optimizer";
import background from "../../public/firpo-color.png";
import { type PropsWithLocalizedCopy } from "../types/misc";
import type PropsWithClassName from "../types/propsWithClassName";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";
import {type PropsWithChildren} from "react";

const HeroTitle = (props: PropsWithLocalizedCopy) =>
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
        {props.localizedCopy.home.hero.name}
    </h2>
);

const HeroSubtitle = (props: PropsWithLocalizedCopy) =>
(
    <h3 className="w-[30svw]
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
        {props.localizedCopy.home.hero.subtitle}
    </h3>
);

const HeroText = (props: PropsWithClassName<PropsWithLocalizedCopy>) =>
(
    <div className={`flex
        flex-col
        gap-y-2
        mobile_lg:gap-y-3
        sm:gap-y-4
        md:gap-y-5
        lg:gap-y-8
        xl:gap-y-10
        ${props.className}`}>
        <HeroTitle localizedCopy={props.localizedCopy}/>
        <HeroSubtitle localizedCopy={props.localizedCopy}/>
    </div>
);

const HeroBackground = (props: PropsWithClassName<PropsWithChildren>) =>
(
    <div className={props.className}>
        <ExportedImage src={background} alt="Marcelo Firpo" priority={true} fetchPriority="high" sizes="100svw"/>
        {props.children}
    </div>
);

const HeroContent = (props: PropsWithLocalizedCopy) =>
{
    const iconPaths = {
        email: "/icons/hero-icons/email-icon.svg",
        linkedin: "/icons/hero-icons/linkedin-icon.svg"
    };

    return (
        <>
            <HeroText className="absolute
                             w-[23%]
                             right-[21%]
                             top-[26%]
                             mobile_md:top-[16%]
                             mobile_lg:top-[13%]
                             sm:top-[14%]
                             md:top-[16%]
                             lg:top-[20%]
                             xl:top-[27%]"
                      localizedCopy={props.localizedCopy}/>
            <NavBar
                iconPaths={iconPaths}
                className="absolute
                           right-[0%]
                           max-sm:left-[16px]
                           sm:right-[14%]
                           md:right-[16%]
                           lg:right-[18%]
                           xl:right-[21.56%]
                           top-[16px]
                           sm:top-[5%]
                           md:top-[6%]
                           lg:top-[10%]
                           xl:top-[12.6%]"/>
        </>
    );
};

export const Hero = (props: PropsWithLocalizedCopy) =>
(
    <VerticalCenterBox className="relative
                                  w-responsive
                                  max-h-responsive-screen
                                  min-h-[180px]
                                  mobile_sm:min-h-[200px]
                                  mobile_md:min-h-[210px]
                                  mobile_lg:min-h-[225px]
                                  sm:min-h-[330px]
                                  md:min-h-[400px]
                                  lg:min-h-[510px]
                                  xl:min-h-[600px]
                                  overflow-hidden">
        <HeroBackground className="relative top-[-2%] lg:top-[-11%]"/>
        <HeroContent localizedCopy={props.localizedCopy}/>
    </VerticalCenterBox>
);
