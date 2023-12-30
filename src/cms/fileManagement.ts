import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { type PublicFolder, publicFolderValue, worksPath} from "~/config";
import { type StringWithInnerSubstring } from "~/typeSafety";

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
    const extension = path.extname(getPath(dirent)).toLowerCase();
    return extension === ".png"
        || extension === ".jpg";
};

export const isUrlPredicate = (dirent: Dirent) =>
{
    const extension = path.extname(getPath(dirent)).toLowerCase();
    return extension === ".url";
};

export function filterImagesAndUrls(directoryEntries: Dirent[])
{
    return directoryEntries
        .filter(isFilePredicate)
        .filter(dirent => isImagePredicate(dirent) || isUrlPredicate(dirent))
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

export async function getFileRelative(filePath: string)
{
    return await fileSystem.readFile(path.join(process.cwd(), filePath));
}

export function getFirstMarkdownFile(directoryEntries: Dirent[])
{
    return directoryEntries
    .filter((dirent: Dirent) => dirent.isFile())
    .filter((dirent: Dirent) => path.extname(getPath(dirent)).toLowerCase() === ".md")[0];
}

export const absoluteToRelativePath = (imagePath: StringWithInnerSubstring<PublicFolder>) => (imagePath.split(path.join(publicFolderValue)))[1]!;

export const removeMarkdownExtension = (name: string) => name.replace(".md", "");

export function getPath(dirent: Dirent)
{
    return path.join(dirent.path, dirent.name);
}
