import ExportedImage from "next-image-export-optimizer";
import background from "../../public/firpo-color.png";
import { type PropsWithLocalizedCopy } from "../types/misc";
import { Reveal } from "./Reveal";

export const Hero = (props: PropsWithLocalizedCopy) => (
  <section className="relative min-h-[clamp(400px,60vh,100dvh)] overflow-hidden flex flex-col justify-end pb-12 lg:pb-20 px-6 lg:px-12">
    <div className="absolute inset-0">
      <ExportedImage
        src={background}
        alt="Marcelo Firpo"
        priority={true}
        fetchPriority="high"
        sizes="100svw"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/60" />
    </div>
    <div className="relative z-10">
      <Reveal delay={350}>
        <h1 className="font-serif font-semibold text-[clamp(2rem,5vw,6rem)] text-dawn leading-[1.05] tracking-tight max-w-[18ch]">
          {props.localizedCopy.home.hero.name}
        </h1>
      </Reveal>
      <Reveal delay={550}>
        <p className="text-[clamp(1rem,3vw,1.5rem)] text-mist mt-6 lg:mt-10 max-w-[44ch] leading-[1.7]">
          {props.localizedCopy.home.hero.subtitle}
        </p>
      </Reveal>
    </div>
  </section>
);
