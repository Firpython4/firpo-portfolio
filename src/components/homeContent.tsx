import { type HomeProps } from "~/index";
import { BottomBar } from "./bottomBar";
import ContactForm from "./contactForm";
import { ExpositionText } from "./expositionText";
import { Hero } from "./hero";
import { Collections } from "./pieceCollection";
import { Scaffold } from "./scaffold";

const HomeContent = (props: HomeProps) => (
  <>
    <Scaffold>
      <Hero localizedCopy={props.localizedCopy} />
      <ExpositionText
        className="pt-[10px]
                                   mobile_sm:pt-[25px]
                                   mobile_md:pt-[40px]
                                   mobile_lg:pt-[55px]
                                   sm:pt-[70px]
                                   md:pt-[85px]
                                   lg:pt-[100px]
                                   xl:pt-[118px]"
        locale={props.locale}
        localizedCopy={props.localizedCopy}
      />
      <div className="pt-28">
        <Collections
          collections={props.collections}
          locale={props.locale}
          orderFile={props.orderFile}
        />
      </div>
      <h2 className="font-inter text-black font-semibold leading-normal text-medium pt-20">
        {props.localizedCopy.home.callToAction.solveYourCommunicationProblems}
      </h2>
      <ContactForm
        className="pt-8"
        locale={props.locale}
        copy={props.localizedCopy}
      />
      <BottomBar className="pb-12 pt-20" localizedCopy={props.localizedCopy} />
    </Scaffold>
  </>
);

export default HomeContent;
