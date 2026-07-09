import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id?: string;
  bg: "dawn" | "ink" | "sunrise" | "seafoam";
  className?: string;
  tag?: string;
  tagColor?: "text-ink" | "text-mist";
  title: string;
  titleColor?: string;
  titleMaxW?: string;
  titleSize?: "normal" | "large";
  intro?: string;
  introColor?: string;
  introMaxW?: string;
  introSize?: "normal" | "small";
  introClassName?: string;
  children?: ReactNode;
}

const bgMap: Record<string, string> = {
  dawn: "bg-dawn",
  ink: "bg-ink",
  sunrise: "bg-sunrise",
  seafoam: "bg-seafoam",
};

const sizeMap: Record<string, string> = {
  normal: "text-[clamp(1.8rem,4vw,3.6rem)]",
  large: "text-[clamp(2rem,5vw,4.5rem)]",
};

const introSizeMap: Record<string, string> = {
  normal: "text-[clamp(1.2rem,1.8vw,1.5rem)]",
  small: "text-[clamp(1rem,2vw,1.3rem)]",
};

export function Section({
  id,
  bg,
  className = "",
  tag,
  tagColor = "text-mist",
  title,
  titleColor = "",
  titleMaxW = "",
  titleSize = "normal",
  intro,
  introColor = "",
  introMaxW = "",
  introSize = "normal",
  introClassName = "",
  children,
}: SectionProps) {
  return (
    <section id={id} className={`py-16 lg:py-32 px-6 lg:px-12 ${bgMap[bg]} ${className}`}>
      {tag && (
        <Reveal>
          <p className={`text-[0.65rem] tracking-[0.18em] uppercase ${tagColor} mb-4 lg:mb-5`}>{tag}</p>
        </Reveal>
      )}
      <Reveal>
        <h2 className={`font-serif font-semibold ${sizeMap[titleSize]} ${titleColor} leading-[1.1] tracking-tight ${titleMaxW} mb-4 lg:mb-6`}>
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal>
          <p className={`font-sans ${introSizeMap[introSize] ?? introSize} ${introColor} leading-[1.7] tracking-tight ${introMaxW} ${introClassName}`}>
            {intro}
          </p>
        </Reveal>
      )}
      {children}
    </section>
  );
}
