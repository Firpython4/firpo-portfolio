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
        className="px-[clamp(16px,5vw,80px)] py-12 lg:py-16"
        locale={props.locale}
        localizedCopy={props.localizedCopy}
      />
      <section className="px-[clamp(16px,5vw,80px)] py-12">
        <h2 className="mb-8 text-center font-display text-xl font-normal italic text-charcoal lg:mb-12 lg:text-2xl">
          {props.localizedCopy.home.about.selectedWork}
        </h2>
        <div className="min-h-[200px] px-4">
          <Collections collections={props.collections} locale={props.locale} />
        </div>
      </section>
      <section className="px-[clamp(16px,5vw,80px)] py-12">
        <h2 className="mb-8 text-center font-display text-xl font-normal text-charcoal lg:text-2xl">
          {props.localizedCopy.home.callToAction.howCanIHelpYou}
        </h2>
        <ContactForm
          className="mx-auto max-w-2xl"
          locale={props.locale}
          copy={props.localizedCopy}
        />
      </section>
      <BottomBar
        className="px-[clamp(16px,5vw,80px)] pb-12 pt-8"
        localizedCopy={props.localizedCopy}
      />
    </Scaffold>
  </>
);

export default HomeContent;
