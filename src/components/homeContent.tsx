import { type HomeProps } from "~/index";
import { BottomBar } from "./bottomBar";
import ContactForm from "./contactForm";
import { ExpositionText } from "./expositionText";
import { Hero } from "./hero";
import { Collections } from "./pieceCollection";
import Scaffold from "./scaffold";

const HomeContent = (props: HomeProps) => (
  <>
    <Scaffold>
      <Hero localizedCopy={props.localizedCopy} />
      <ExpositionText
        className="pt-[clamp(10px,5vw,118px)]"
        locale={props.locale}
        localizedCopy={props.localizedCopy}
      />
      <div className="pt-[clamp(2rem,6vw,7rem)]">
        <Collections
          collections={props.collections}
          locale={props.locale}
          orderFile={props.orderFile}
        />
      </div>
      <h2 className="text-[clamp(0.8rem,2vw,3rem)] pt-[clamp(2rem,6vw,5rem)] text-center font-inter font-medium leading-normal text-black">
        {props.localizedCopy.home.callToAction.howCanIHelpYou}
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
