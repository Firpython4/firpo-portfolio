import Image from "next/image";
import background from "../../public/firpo-color.png";
import { HorizontalCenter } from "./horizontalCenter";
import { NavBar } from "./navBar";

export const Hero = () =>
(
    <div className=" w-full overflow-hidden">
        <HorizontalCenter>
            <div className="relative w-[1920px] h-[933px]">
                <div className="absolute bg-gradient-to-r from-black/5 to-black/10"/>
                <div className="relative top-[-120px]">
                    <Image width={1920} height={933} src={background.src} alt="Marcelo Firpo"/>
                </div>
                <h2 className={`absolute w-[752px] shrink-0 text-white text-[107px] not-italic font-semibold leading-[98px] tracking-[-3.745px] left-[54.63%] top-[27.22%]  font-hepta_slab`}>
                    Marcelo Firpo
                </h2>
                <h3 className={`absolute w-[500px] h-[345px] text-white text-[44px] not-italic font-bold leading-[50px] left-[54.73%] top-[54.76%] font-hepta_slab`}>
                    CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista
                </h3>
                <NavBar/>
            </div>
        </HorizontalCenter>
    </div>
);
