import type { ReactNode } from "react";

interface CtaButtonProps {
  href: string;
  variant?: "sunrise" | "ink";
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  sunrise: "bg-sunrise text-ink hover:bg-dawn",
  ink: "bg-ink text-dawn hover:bg-dawn hover:text-ink",
};

export function CtaButton({ href, variant = "ink", className = "", children }: CtaButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-3 ${variantClasses[variant]} py-3 lg:py-4 px-6 lg:px-8 text-[clamp(0.75rem,1.25vw,1rem)] font-medium no-underline rounded-[2px] hover:-translate-y-0.5 transition-all ${className}`}
    >
      {children}
    </a>
  );
}
