import Image from "next/image";
import background from "../../public/firpo-color.png";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";

export const Hero = () =>
(
    <div className=" w-responsive-screen overflow-hidden">
        <VerticalCenterBox>
            <div className="relative w-responsive-screen h-responsive-screen">
                <div className="relative top-[-120px]">
                    <Image width={5760} height={2799} src={background.src} alt="Marcelo Firpo"/>
                </div>
                <h2 className={`absolute w-[752px] shrink-0 text-white text-large not-italic font-semibold leading-[98px] tracking-[-3.745px] left-[54.63%] top-[27.22%]  font-hepta_slab`}>
                    Marcelo Firpo
                </h2>
                <h3 className={`absolute w-[500px] h-[345px] text-white text-medium not-italic font-bold leading-[50px] left-[54.73%] top-[54.76%] font-hepta_slab`}>
                    CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista
                </h3>
                <div className="absolute right-[21.56%] top-[13.61%]">
                    <NavBar/>
                </div>
            </div>
        </VerticalCenterBox>
    </div>
);
