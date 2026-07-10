"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { type Locale } from "~/localization/localization";
import { linkedInLink } from "~/config";

interface NavItem {
  label: string;
  href: string;
}

interface SiteNavProps {
  navLinks: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  locale: Locale;
}

function InlineLocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    const newPath = pathname.replace(locale, newLocale);
    router.replace(newPath, { scroll: false });
  }

  const isPt = locale === "pt";

  return (
    <button
      onClick={() => switchLocale(isPt ? "en" : "pt")}
      className="text-xs uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
    >
      {isPt ? "EN" : "PT"}
    </button>
  );
}

function MobileLocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    const newPath = pathname.replace(locale, newLocale);
    router.replace(newPath, { scroll: false });
  }

  const isPt = locale === "pt";

  return (
    <>
      <button
        onClick={() => switchLocale("pt")}
        className={`text-sm uppercase tracking-widest ${isPt ? "text-sunrise font-medium" : "text-mist hover:text-ink"}`}
      >
        PT
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`text-sm uppercase tracking-widest ${!isPt ? "text-sunrise font-medium" : "text-mist hover:text-ink"}`}
      >
        EN
      </button>
    </>
  );
}

export function SiteNav({ navLinks, ctaLabel, ctaHref, locale }: SiteNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 lg:py-5 bg-dawn/90 backdrop-blur-xl border-b border-mist/35">
        <Link href="/" className="font-serif text-[1.1rem] text-ink no-underline tracking-tight">
          Marcelo Firpo
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[clamp(0.7rem,1vw,0.8rem)] text-ink no-underline opacity-85 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
          <a
            href={ctaHref}
            className="text-[clamp(0.7rem,1vw,0.8rem)] text-dawn no-underline bg-ink px-[1.4rem] py-[0.55rem] rounded-[2px] opacity-100 hover:bg-sunrise hover:text-ink transition-colors"
          >
            {ctaLabel}
          </a>
          <a
            href={linkedInLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-ink transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <InlineLocaleSwitcher locale={locale} />
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-ink transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-dawn z-50 lg:hidden shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif text-xl text-ink">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 text-ink hover:text-sunrise"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-lg text-ink no-underline hover:text-sunrise transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ctaHref}
              onClick={closeMenu}
              className="text-lg text-ink no-underline hover:text-sunrise transition-colors"
            >
              {ctaLabel}
            </a>
          </nav>

          <div className="pt-6 border-t border-mist/30">
            <div className="flex gap-4 items-center">
              <a
                href={linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mist hover:text-ink transition-colors"
              >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <MobileLocaleSwitcher locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
