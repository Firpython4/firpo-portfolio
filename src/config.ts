export const publicFolderValue = "public";
export const worksPath = `/${publicFolderValue}/works` as const;

export type publicFolder = typeof publicFolderValue;
