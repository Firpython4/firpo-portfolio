import Image from "next/image";
import background from "../../public/firpo-color.png";
import { VerticalCenterBox } from "./verticalCenterBox";
import { NavBar } from "./navBar";

export const Hero = () =>
(
    <div className=" w-responsive-screen overflow-hidden">
        <VerticalCenterBox>
            <div className="relative w-responsive-screen h-responsive-screen">
                <div className="relative top-[-11%]">
                    <Image width={5760} height={2799} src={background.src} alt="Marcelo Firpo"/>
                </div>
                <div className="flex flex-col gap-y-1 md:gap-y-2 lg:gap-y-5 xl:gap-y-10 absolute w-[23%] right-[21%] top-[15%] lg:top-[20%] xl:top-[27.22%]">
                    <h2 className={`shrink-0 text-white text-large not-italic font-semibold leading-[60px] lg:leading-[80px] xl:leading-[98px] tracking-[-3.745px] font-hepta_slab`}>
                        Marcelo Firpo
                    </h2>
                    <h3 className={`w-[200px] w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px] text-white text-medium not-italic font-bold leading-[30px] md:leading-[40px] lg:leading-[50px] font-hepta_slab`}>
                        CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista
                    </h3>
                </div>
                <div className="absolute right-[21.56%] top-[5%] lg-top-[7%] xl:top-[13.61%]">
                    <NavBar/>
                </div>
            </div>
        </VerticalCenterBox>
    </div>
);
