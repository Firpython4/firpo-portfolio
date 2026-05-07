import { NavBar } from "~/components/navBar";
import { type PropsWithLocalizedCopy } from "../types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

export const BottomBar = (
  props: PropsWithClassName<PropsWithLocalizedCopy>,
) => (
  <footer
    className={`${props.className} flex flex-col items-center justify-center gap-6 border-t border-charcoal/10 pt-12 md:flex-row md:gap-8`}
  >
    <p className="font-body text-sm font-medium uppercase tracking-widest text-charcoal-muted">
      {props.localizedCopy.home.callToAction.getInTouch}
    </p>
    <NavBar
      iconPaths={{
        email: "/icons/email-icon.svg",
        linkedin: "/icons/linkedin-icon.svg",
      }}
    />
  </footer>
);
