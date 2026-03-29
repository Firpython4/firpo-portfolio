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
                   animate-fade-up
                   font-hepta_slab
                   text-large
                   font-semibold
                   not-italic
                   leading-[clamp(20px,5vw,98px)]
                   tracking-[clamp(-2px,-3vw,-3.745px)]
                   text-white
                   animate-duration-300"
  >
    {props.localizedCopy.home.hero.name}
  </h2>
);

const HeroSubtitle = (props: PropsWithLocalizedCopy) => (
  <h3
    className="animate-fade-up
               font-hepta_slab
               text-[clamp(0.5rem,2vw,2rem)]
               font-bold
               not-italic
               leading-[clamp(14px,4vw,50px)]
               text-white
               animate-duration-700
               max-[210px]:hidden"
  >
    {props.localizedCopy.home.hero.subtitle}
  </h3>
);

const HeroText = (props: PropsWithClassName<PropsWithLocalizedCopy>) => (
  <div
    className={`flex max-[200px]:text-center flex-col gap-y-[clamp(8px,3vw,40px)] ${props.className}`}
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
                    py-[clamp(5%,10%,15%)]
                    top-[clamp(16%,20%,27%)]
                    right-0
                    w-[clamp(50%,58%,60%)]"
        localizedCopy={props.localizedCopy}
      />
      <NavBar
        iconPaths={iconPaths}
        className="absolute
                   top-4
                   right-4
                   md:top-6
                   md:right-[4%]
                   lg:right-[8%]
                   lg:top-[10%]"
      />
    </>
  );
};

export const Hero = (props: PropsWithLocalizedCopy) => (
  <VerticalCenterBox
    className="w-responsive
               relative
               min-h-[clamp(180px,30vw,600px)]
               overflow-hidden
               max-h-responsive-screen"
  >
    <HeroBackground className="relative top-[-2%] lg:top-[-11%]" />
    <HeroContent localizedCopy={props.localizedCopy} />
  </VerticalCenterBox>
);
