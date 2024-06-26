import ExportedImage from "next-image-export-optimizer";
import background from "../../public/firpo-color.png";
import { type PropsWithLocalizedCopy } from "../types/misc";
import type PropsWithClassName from "../types/propsWithClassName";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";
import { type PropsWithChildren } from "react";

const HeroTitle = (props: PropsWithLocalizedCopy) => (
  <h2
    className="shrink-0
                   font-hepta_slab
                   text-large
                   font-semibold
                   not-italic
                   leading-[20px]
                   tracking-[-2px]
                   animate-fade-up
                   animate-duration-300
                   text-white
                   mobile_sm:leading-[25px]
                   mobile_md:leading-[30px]
                   mobile_lg:leading-[40px]
                   mobile_lg:tracking-[-3.745px]
                   sm:leading-[50px]
                   md:leading-[60px]
                   lg:leading-[80px]
                   xl:leading-[98px]"
  >
    {props.localizedCopy.home.hero.name}
  </h2>
);

const HeroSubtitle = (props: PropsWithLocalizedCopy) => (
  <h3
    className="mobile_sm:w-[30svw]
                   font-hepta_slab
                   text-medium
                   font-bold
                   not-italic
                   animate-fade-up
                   animate-duration-700
                   leading-[14px]
                   text-white
                   mobile_sm:leading-[16px]
                   mobile_md:w-[160px]
                   mobile_md:leading-[20px]
                   mobile_lg:w-[200px]
                   mobile_lg:leading-[25px]
                   sm:w-[280px]
                   sm:leading-[30px]
                   md:w-[300px]
                   md:leading-[40px]
                   lg:w-[400px]
                   lg:leading-[50px]
                   xl:w-[500px]"
  >
    {props.localizedCopy.home.hero.subtitle}
  </h3>
);

const HeroText = (props: PropsWithClassName<PropsWithLocalizedCopy>) => (
  <div
    className={`flex
        flex-col
        gap-y-2
        mobile_lg:gap-y-3
        sm:gap-y-4
        md:gap-y-5
        lg:gap-y-8
        xl:gap-y-10
        ${props.className}`}
  >
    <HeroTitle localizedCopy={props.localizedCopy} />
    <HeroSubtitle localizedCopy={props.localizedCopy} />
  </div>
);

const HeroBackground = (props: PropsWithClassName<PropsWithChildren>) => (
  <div className={props.className}>
    <ExportedImage
      src={background}
      alt="Marcelo Firpo"
      priority={true}
      fetchPriority="high"
      sizes="100svw"
    />
    {props.children}
  </div>
);

const HeroContent = (props: PropsWithLocalizedCopy) => {
  const iconPaths = {
    email: "/icons/hero-icons/email-icon.svg",
    linkedin: "/icons/hero-icons/linkedin-icon.svg",
  };

  return (
    <>
      <HeroText
        className="absolute
        px-3
        mobile_sm:px-5
                             mobile_sm:right-[21%]
                             top-[26%]
                             mobile_sm:w-[23%]
                             mobile_md:top-[16%]
                             mobile_lg:top-[13%]
                             sm:top-[14%]
                             md:top-[16%]
                             lg:top-[20%]
                             xl:top-[27%]"
        localizedCopy={props.localizedCopy}
      />
      <NavBar
        iconPaths={iconPaths}
        className="absolute
                           right-[0%]
                           top-[16px]
                           max-md:left-[16px]
                           sm:right-[14%]
                           sm:top-[5%]
                           md:right-[16%]
                           md:top-[6%]
                           lg:right-[18%]
                           lg:top-[10%]
                           xl:right-[21.56%]
                           xl:top-[12.6%]"
      />
    </>
  );
};

export const Hero = (props: PropsWithLocalizedCopy) => (
  <VerticalCenterBox
    className="w-responsive
                                  relative
                                  min-h-[180px]
                                  overflow-hidden
                                  max-h-responsive-screen
                                  mobile_sm:min-h-[200px]
                                  mobile_md:min-h-[210px]
                                  mobile_lg:min-h-[225px]
                                  sm:min-h-[330px]
                                  md:min-h-[400px]
                                  lg:min-h-[510px]
                                  xl:min-h-[600px]"
  >
    <HeroBackground className="relative top-[-2%] lg:top-[-11%]" />
    <HeroContent localizedCopy={props.localizedCopy} />
  </VerticalCenterBox>
);
