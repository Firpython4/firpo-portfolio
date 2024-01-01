import Image from "next/image";
import background from "../../public/firpo-color.png";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";
import {locale} from "~/localization/localization";

const HeroTitle = () =>
(
    <h2 className="shrink-0
                   text-white
                   text-large
                   not-italic
                   font-semibold
                   leading-[40px]
                   sm:leading-[50px]
                   md:leading-[60px]
                   lg:leading-[80px]
                   xl:leading-[98px]
                   tracking-[-3.745px]
                   font-hepta_slab">
        {locale.name}
    </h2>
);

const HeroSubtitle = () =>
(
    <h3 className="w-[200px]
                   md:w-[300px]
                   lg:w-[400px]
                   xl:w-[500px]
                   text-white
                   text-medium
                   not-italic
                   font-bold
                   leading-[30px]
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
        gap-y-1
        sm:gap-y-2
        md:gap-y-3
        lg:gap-y-5
        xl:gap-y-10
        ${props.className}`}>
        <HeroTitle/>
        <HeroSubtitle/>
    </div>
);

const HeroBackground = (props: {className?: string}) =>
(
    <div className={props.className}>
        <Image width={5760} height={2799} src={background.src} alt="Marcelo Firpo"/>
    </div>
);

const HeroContent = () =>
(
    <>
        <HeroText className="absolute
                             w-[23%]
                             right-[21%]
                             top-[5%]
                             sm:top-[15%]
                             lg:top-[20%]
                             xl:top-[27.22%]"/>
        <NavBar className="absolute
                           right-[21.56%]
                           top-[8%]
                           sm:top-[10%]
                           md:top-[10%]
                           lg:top-[10%]
                           xl:top-[13.61%]"/>
    </>
);

export const Hero = () =>
(
    <VerticalCenterBox className="w-responsive-screen overflow-hidden">
        <div className="relative w-responsive-screen h-responsive-screen">
            <HeroBackground className="relative top-[-11%]"/>
            <HeroContent/>
        </div>
    </VerticalCenterBox>
);
