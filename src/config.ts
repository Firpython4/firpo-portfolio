import { type ContactFormType } from "./components/contactForm";
import env from "./env";

export const publicFolderValue = "public";
export const collectionsPath = `/${publicFolderValue}/collections` as const;

export const orderFilePath = "order.txt";

export type PublicFolder = typeof publicFolderValue;

export const linkedInLink = "https://www.linkedin.com/in/marcelofirpo/";

const email = "marcelofirpo@gmail.com";
export const emailLink = `mailto:${email}`;

export const submitLink = (formContent: ContactFormType) => {
  return `https://docs.google.com/forms/d/e/${env.NEXT_PUBLIC_FORM_ID}/formResponse?&submit=Submit?usp=pp_url&entry.1712516918=${formContent.Email}&entry.1148141417=${formContent["First Name"]}&entry.640171160=${formContent["Last Name"]}&entry.240749971=${formContent.Subject}&entry.1577369436=${formContent.Content}`;
};
