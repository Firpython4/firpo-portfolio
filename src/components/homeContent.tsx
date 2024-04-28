import {  type HomeProps } from "../index";
import { BottomBar } from "./bottomBar";
import ContactForm from "./contactForm";
import { ExpositionText } from "./expositionText";
import { Hero } from "./hero";
import { PieceCollection } from "./pieceCollection";
import { Scaffold } from "./scaffold";

const HomeContent = (props: HomeProps) => <>
    <Scaffold>
        <Hero localizedTexts={props.localizedTexts}/>
        <ExpositionText className="pt-[10px]
                                   mobile_sm:pt-[25px]
                                   mobile_md:pt-[40px]
                                   mobile_lg:pt-[55px]
                                   sm:pt-[70px]
                                   md:pt-[85px]
                                   lg:pt-[100px]
                                   xl:pt-[118px]"
                        locale={props.locale}
                        localizedTexts={props.localizedTexts}/>
        <div className="pt-28">
            <PieceCollection pieces={props.pieces} locale={props.locale}/>
        </div>
        <ContactForm className="pt-20" locale={props.locale}/>
        <BottomBar className="pt-20 pb-24" localizedTexts={props.localizedTexts}/>
    </Scaffold>
</>;

export default HomeContent;