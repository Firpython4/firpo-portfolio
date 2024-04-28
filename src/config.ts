export const publicFolderValue = "public";
export const worksPath = `/${publicFolderValue}/works` as const;

export const orderFilePath = "public/order.txt";

export type PublicFolder = typeof publicFolderValue;

export const linkedInLink = "https://www.linkedin.com/in/marcelofirpo/";

const email = "marcelofirpo@gmail.com";
export const emailLink = `mailto:${email}`
