import { type Locale } from "~/localization/localization";
import { type PropsWithLocalizedCopy } from "~/types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

const ClientTag = ({ name }: { name: string }) => (
  <span className="inline-block border border-charcoal/50 px-3 py-1 font-body text-xs tracking-wide text-charcoal transition-colors hover:border-sienna hover:text-sienna">
    {name.trim()}
  </span>
);

const parseClients = (clientsString: string): string[] => {
  return clientsString.split(",").map((c) => c.trim());
};

export const ExpositionText = (
  props: PropsWithClassName<{ locale: Locale } & PropsWithLocalizedCopy>,
) => {
  const clientList = parseClients(props.localizedCopy.home.about.clients);

  return (
    <section
      className={`${props.className} flex w-full flex-col gap-10 lg:flex-row lg:gap-16`}
    >
      <div className="lg:w-1/2">
        <p
          className="font-display
                     text-[clamp(1rem,2.5vw,1.5rem)]
                     font-normal
                     leading-[1.6]
                     text-charcoal"
        >
          {props.localizedCopy.home.about.expositionFirst}
        </p>
      </div>

      <div className="lg:w-1/2 lg:pt-8">
        <p
          className="mb-6
                     font-body
                     text-xs
                     font-medium
                     uppercase
                     tracking-[0.15em]
                     text-charcoal"
        >
          {props.localizedCopy.home.about.someAttendedClients}
        </p>
        <div className="flex flex-wrap gap-2">
          {clientList.map((client, index) => (
            <ClientTag key={index} name={client} />
          ))}
        </div>
      </div>
    </section>
  );
};
