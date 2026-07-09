import { type HomeProps } from "~/index";
import { SiteNav } from "./siteNav";
import { Section } from "./section";
import { Reveal } from "./Reveal";
import { Hero } from "./hero";
import { ExpositionText } from "./expositionText";
import { CollectionsList } from "./pieceCollection";
import { ContactForm } from "./contactForm";
import Scaffold from "./scaffold";
import { emailLink } from "~/config";
import { type Locale } from "~/localization/localization";

function getNavLinks(locale: Locale, localizedCopy: HomeProps["localizedCopy"]) {
  const work = localizedCopy.home.about.selectedWork.replace(":", "");
  const contact = locale === "pt" ? "Contacto" : "Contact";
  return [
    { label: work, href: "#work" },
    { label: contact, href: "#contact" },
  ];
}

const HomeContent = (props: HomeProps) => {
  const locale = props.locale as Locale;

  return (
    <>
      <SiteNav
        navLinks={getNavLinks(locale, props.localizedCopy)}
        ctaLabel={props.localizedCopy.home.callToAction.getInTouch}
        ctaHref={emailLink}
        locale={locale}
      />
      <Scaffold>
        <Hero localizedCopy={props.localizedCopy} />

        <Section
          bg="dawn"
          title=""
          introSize="normal"
          introMaxW="max-w-[70ch]"
          introColor="text-[#5A5855]"
          introClassName="mb-10 lg:mb-16"
        >
          <ExpositionText
            locale={locale}
            localizedCopy={props.localizedCopy}
          />
        </Section>

        <Section
          id="work"
          bg="dawn"
          tag=""
          title={props.localizedCopy.home.about.selectedWork}
          titleSize="large"
          className="pt-0"
        >
          <div className="min-h-[200px] px-4">
            <CollectionsList collections={props.collections} locale={locale} />
          </div>
        </Section>

        <Section
          id="contact"
          bg="sunrise"
          tag=""
          title={props.localizedCopy.home.callToAction.howCanIHelpYou}
          titleSize="large"
          titleColor="text-ink"
          titleMaxW="max-w-[40ch]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8 lg:mt-12">
            <Reveal>
              <ContactForm
                locale={locale}
                copy={props.localizedCopy}
              />
            </Reveal>
          </div>
        </Section>

        <footer className="py-6 lg:py-8 px-6 lg:px-12 bg-ink flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-t border-white/[0.06]">
          <div className="font-serif text-[1rem] lg:text-[1.1rem] text-dawn">
            Marcelo Firpo
          </div>
          <div className="text-[1rem] text-mist opacity-50">
            © {new Date().getFullYear()} Marcelo Firpo
          </div>
        </footer>
      </Scaffold>
    </>
  );
};

export default HomeContent;
