import ExportedImage from "next-image-export-optimizer";
import background from "../../public/firpo-color.png";
import { type PropsWithLocalizedCopy } from "../types/misc";
import { Reveal } from "./Reveal";

export const Hero = (props: PropsWithLocalizedCopy) => (
  <section className="relative min-h-[clamp(400px,60vh,100dvh)] lg:min-h-[95svh] overflow-hidden flex flex-col justify-center items-end">
    <div className="absolute inset-0">
      <ExportedImage
        src={background}
        alt="Marcelo Firpo"
        priority={true}
        fetchPriority="high"
        sizes="100svw"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
    </div>
    <div className="relative z-10 text-left bg-sunrise w-auto max-w-[55%] lg:max-w-[45%]">
      <div className="pr-4 lg:pr-20 pl-4 lg:pl-12">
        <Reveal delay={350}>
          <h1 className="font-serif font-semibold text-[clamp(2rem,5vw,6rem)] text-ink leading-[1.05] tracking-tight pt-4 lg:pt-6 mb-4 lg:mb-6">
            {props.localizedCopy.home.hero.name}
          </h1>
        </Reveal>
        <Reveal delay={550}>
          <p className="font-sans font-semibold text-[clamp(1.2rem,1.8vw,1.5rem)] text-ink/70 max-w-[44ch] leading-[1] tracking-tight pb-4 lg:pb-6">
            {props.localizedCopy.home.hero.subtitle}
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
