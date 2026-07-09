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

function getNavLinks(locale: Locale) {
  if (locale === "pt") {
    return [
      { label: "Trabalhos", href: "#work" },
      { label: "Contacto", href: "#contact" },
    ];
  }
  return [
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];
}

function getCtaLabel(locale: Locale) {
  return locale === "pt" ? "Falar comigo" : "Get in touch";
}

const HomeContent = (props: HomeProps) => {
  const locale = props.locale as Locale;

  return (
    <>
      <SiteNav
        navLinks={getNavLinks(locale)}
        ctaLabel={getCtaLabel(locale)}
        ctaHref={emailLink}
        locale={locale}
      />
      <Scaffold>
        <Hero localizedCopy={props.localizedCopy} />

        <Section
          bg="dawn"
          tag={locale === "pt" ? "Sobre" : "About"}
          title={locale === "pt" ? "Clareza que comunica." : "Clarity that communicates."}
          intro={locale === "pt"
            ? "Grandes marcas precisam traduzir contextos complexos na forma de conceitos simples, mas poderosos."
            : "Big brands need to translate complex contexts into simple yet powerful concepts."}
          introSize="normal"
          introMaxW="max-w-[52ch]"
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
          tag={locale === "pt" ? "Portfolio" : "Portfolio"}
          title={locale === "pt" ? "Trabalhos selecionados." : "Selected work."}
          introMaxW="max-w-[52ch]"
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
          title={locale === "pt" ? "Vamos conversar?" : "Let's talk?"}
          titleSize="large"
          titleColor="text-ink"
          titleMaxW="max-w-[20ch]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8 lg:mt-12">
            <Reveal>
              <p className="text-[clamp(1rem,1.8vw,1.3rem)] text-ink/70 leading-[1.65] max-w-[40ch] font-medium">
                {locale === "pt"
                  ? "Estou sempre aberto a novos projetos, parcerias e desafios criativos."
                  : "I'm always open to new projects, partnerships, and creative challenges."}
              </p>
            </Reveal>
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
