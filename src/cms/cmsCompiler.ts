import { cms } from "./cmsSchemas";
import { type CollectionsType } from "./schemaTypes";
import { relativePath, safePath } from "./type-fs/src/fileManagement";

export const replaceNewlines = (text: string) => {
  const literalNewLine = "\\n";
  const newLineChar = "\n";
  return text.replaceAll(literalNewLine, newLineChar);
};

async function compileCms() {
  const result = await cms.parse(relativePath(safePath("")));
  if (result.wasResultSuccessful) {
    return result.okValue;
  } else {
    throw result.errorValue;
  }
}

async function getOrCacheCompiledCms() {
  if (!cachedCms) {
    cachedCms = await compileCms();
  }

  return cachedCms;
}

let cachedCms: CollectionsType | null = null;

export default getOrCacheCompiledCms;
