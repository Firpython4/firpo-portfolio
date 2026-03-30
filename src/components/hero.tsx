import ExportedImage from "next-image-export-optimizer";
import background from "../../public/firpo-color.png";
import { type PropsWithLocalizedCopy } from "../types/misc";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";

const HeroTitle = (props: PropsWithLocalizedCopy) => (
  <h2
    className="font-hepta_slab
                   animate-fade-up
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
    className="font-hepta_slab
               animate-fade-up
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

const HeroText = (props: PropsWithLocalizedCopy & { className?: string }) => (
  <div
    className={`flex flex-col gap-y-[clamp(8px,3vw,40px)] max-[200px]:text-center ${props.className}`}
  >
    <HeroTitle localizedCopy={props.localizedCopy} />
    <HeroSubtitle localizedCopy={props.localizedCopy} />
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
                    right-0
                    top-[clamp(16%,20%,27%)]
                    w-[clamp(42%,50%,52%)]
                    py-[clamp(5%,10%,15%)]"
        localizedCopy={props.localizedCopy}
      />
      <NavBar
        iconPaths={iconPaths}
        className="absolute
                   right-4
                   top-4
                   md:right-8
                   md:top-6
                   lg:right-12
                   lg:top-12"
      />
    </>
  );
};

const HeroBackground = () => (
  <div className="relative top-[-2%] lg:top-[-11%]">
    <ExportedImage
      src={background}
      alt="Marcelo Firpo"
      priority={true}
      fetchPriority="high"
      sizes="100svw"
    />
  </div>
);

export const Hero = (props: PropsWithLocalizedCopy) => (
  <VerticalCenterBox
    className="w-responsive
               relative
               min-h-[clamp(180px,30vw,600px)]
               overflow-hidden
               max-h-responsive-screen"
  >
    <HeroBackground />
    <HeroContent localizedCopy={props.localizedCopy} />
  </VerticalCenterBox>
);
