import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { publicFolderValue, worksPath } from "../config";
import { StringWithInnerSubstring } from "../typeSafety";

export function getSubdirectories(directories: Dirent[])
{
    return directories.map(async directoryEntity =>
                           {
                               const directoryEntities: Dirent[] = await fileSystem.readdir(getPath(directoryEntity), {withFileTypes: true});
                               return {
                                   parent: directoryEntity,
                                   sub: directoryEntities
                               }
                           });
}

export const isFilePredicate = (dirent: Dirent) => dirent.isFile();

export const isImagePredicate = (dirent: Dirent) =>
{
    const extension: string = path.extname(getPath(dirent)).toLowerCase();
    return extension === ".png" || extension === ".jpg";
};

export function filterImages(directoryEntries: Dirent[])
{
    return directoryEntries
    .filter(isFilePredicate)
    .filter(isImagePredicate)
    .map(getPath);
}

export async function getWorksDirectoryEntities()
{
    return await fileSystem.readdir(path.join(process.cwd(), worksPath), {withFileTypes: true});
}

export async function getWorkDirectory(work: string)
{
    return await fileSystem.readdir(path.join(process.cwd(), worksPath, work), {withFileTypes: true});
}

export function getFirstMarkdownFile(directoryEntries: Dirent[])
{
    return directoryEntries
    .filter((dirent: Dirent) => dirent.isFile())
    .filter((dirent: Dirent) => path.extname(getPath(dirent)).toLowerCase() === ".md")[0];
}

export const absoluteToRelativePath = (imagePath: StringWithInnerSubstring<"public">) => (imagePath.split(path.join(publicFolderValue)))[1]!;

export const removeMarkdownExtension = (name: string) => name.replace(".md", "");

export function getPath(dirent: Dirent)
{
    return path.join(dirent.path, dirent.name);
}
