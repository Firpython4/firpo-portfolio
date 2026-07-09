import { type Locale } from "~/localization/localization";
import { type PropsWithLocalizedCopy } from "~/types/misc";
import type PropsWithClassName from "../types/propsWithClassName";

const ClientTag = ({ name }: { name: string }) => (
  <span className="inline-block border border-ink/30 px-3 py-[0.35rem] font-sans text-[0.7rem] tracking-wide text-ink transition-colors hover:border-sunrise hover:text-sunrise">
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
    <div className="flex w-full flex-col gap-10 lg:flex-row lg:gap-16">
      <div className="lg:w-1/2">
        <p
          className="whitespace-pre-line font-sans
                     text-[clamp(1rem,1.5vw,1.15rem)]
                     font-normal
                     leading-[1.65]
                     text-[#5A5855]"
        >
          {props.localizedCopy.home.about.expositionFirst}
        </p>
      </div>

      <div className="lg:w-1/2 lg:pt-8">
        <p
          className="mb-6
                     font-sans
                     text-[0.65rem]
                     font-medium
                     uppercase
                     tracking-[0.18em]
                     text-mist"
        >
          {props.localizedCopy.home.about.someAttendedClients}
        </p>
        <div className="flex flex-wrap gap-2">
          {clientList.map((client, index) => (
            <ClientTag key={index} name={client} />
          ))}
        </div>
      </div>
    </div>
  );
};
