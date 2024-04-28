import { type Dirent } from "fs";
import { getPath } from "./type-fs/fileManagement";
import { readdir } from "fs/promises";
import path from "path";
import { type Brand } from "./type-fs/typeSafety";

export type CollectionId = Brand<string, "collectionId">;

export function getCollectionsFromDirectories(directories: Dirent[]) {
  return directories.map(async (directoryEntity) => {
    const directoryPath = getPath(directoryEntity);
    const id = directoryPath.split(`collections${path.sep}`)[1]!;
    const directoryEntities = await readdir(directoryPath, {
      withFileTypes: true,
    });
    return {
      id: id as CollectionId,
      path: directoryPath,
      directoryEntities,
    };
  });
}
