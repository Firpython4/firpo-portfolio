import background from "../../public/firpo-color.png";
import Image from "next/image"

export const Hero = () => <>
    <Image width={1920} height={933} className="self-center" src={background.src} alt="Marcelo Firpo"/>
        <div
            className="absolute w-[752px] shrink-0 text-white text-[107px] not-italic font-semibold leading-[98px] tracking-[-3.745px] pl-[1049px] top-0 pt-[254px]">Marcelo
            Firpo
        </div>
        <div
            className="absolute w-[400px] h-[345px] text-white text-[44px] not-italic font-bold leading-[46.5px] pl-[1051px] top-0 pt-[511px]">CMO,
            Diretor de Criação, Consultor Criativo, Redator, Roteirista
        </div>
</>;
