import { Hepta_Slab } from "@next/font/google";
import background from "../../public/firpo-color.png";
import Image from "next/image"

const heptaSlab = Hepta_Slab
(
    {
        subsets: ["latin"],
        variable: "--font-hepta-slab"
    }
)

export const Hero = () => <>
    <Image width={1920} height={933} className="self-center" src={background.src} alt="Marcelo Firpo"/>
        <div
            className={`absolute w-[752px] shrink-0 text-white text-[107px] not-italic font-semibold leading-[98px] tracking-[-3.745px] pl-[1049px] top-0 pt-[254px] ${heptaSlab.variable} font-hepta_slab`}>Marcelo
            Firpo
        </div>
        <div
            className={`absolute w-[500px] h-[345px] text-white text-[44px] not-italic font-bold leading-[46.5px] left-[1051px] top-0 pt-[511px] ${heptaSlab.variable} font-hepta_slab`}>CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista
        </div>
</>;
