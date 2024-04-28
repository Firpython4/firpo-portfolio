import { relativePath, safePath } from "~/cms/tcms/fileManagement";
import { type Brand } from "~/cms/tcms/typeSafety";
import { collections } from "./cmsSchemas";
import { type CollectionsType } from "./schemaTypes";

export const replaceNewlines = (text: string) => {
  const literalNewLine = "\\n";
  const newLineChar = "\n";
  return text.replaceAll(literalNewLine, newLineChar);
};

async function compileCms() {
  const result = await collections.parse(
    relativePath(safePath("public/collections")),
  );
  if (result.wasResultSuccessful) {
    return result.okValue;
  } else {
    throw result.errorValue;
  }
}

export type CollectionId = Brand<string, "collectionId">;

async function getOrCacheCompiledCms() {
  if (!cachedCms) {
    cachedCms = await compileCms();
  }

  return cachedCms;
}

let cachedCms: CollectionsType | null;

export default getOrCacheCompiledCms;
