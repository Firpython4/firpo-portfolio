import {type Dirent, promises as fileSystem} from "node:fs";
import path from "node:path";
import {collectionsPath, type PublicFolder, publicFolderValue} from "~/config";
import {includesInner, type StringWithInnerSubstring} from "~/typeSafety";

export function getSubdirectories(directories: Dirent[])
{
    return directories.map(async directoryEntity =>
                           {
                               const path = getPath(directoryEntity);
                               const directoryEntities: Dirent[] = await fileSystem.readdir(path, {withFileTypes: true});
                               return {
                                   path: path,
                                   directoryEntities: directoryEntities
                               }
                           });
}

export const isFile = (dirent: Dirent) => dirent.isFile();

export const isImage = (dirent: Dirent) =>
{
    const extension = path.extname(getPath(dirent)).toLowerCase();
    return extension === ".png"
        || extension === ".jpg";
};

export const isVideoUrl = (dirent: Dirent) =>
{
    const extension = path.extname(getPath(dirent)).toLowerCase();
    return extension === ".url";
};

async function toImageOrUrl(dirent: Dirent)
{
    const path = getPath(dirent);
    if (includesInner(path, publicFolderValue))
    {
        if (isImage(dirent))
        {
            return {
                type: "image" as const,
                path: absoluteToRelativePath(path)
            }
        }
        else if (isVideoUrl(dirent))
        {
            return {
                type: "video" as const,
                url: await getVideoUrl(path)
            }
        }

        throw new Error(`Unsupported file format: ${path}`)
    }

    throw new Error(`${path} is not contained in the public folder`)
}

export async function getAllCollections()
{
    return await fileSystem.readdir(path.join(process.cwd(), collectionsPath), {withFileTypes: true});
}

export async function readCollectionDirectory(collection: string)
{
    return await fileSystem.readdir(path.join(process.cwd(), collectionsPath, collection), {withFileTypes: true});
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
export const removeExtension = (name: Dirent) => name.name.replace(path.extname(name.name), "");

export function getPath(dirent: Dirent)
{
    return path.join(dirent.path, dirent.name);
}

export function getExtension(imageDirent: Dirent)
{
    return path.extname(getPath(imageDirent));
}

export async function getVideoUrl(imageOrUrlPath: `${string}public${string}`)
{
    return (await fileSystem.readFile(imageOrUrlPath)).toString();
}

export async function exists(path: string)
{
    try
    {
        await fileSystem.access(path);
        return true;
    }
    catch (error)
    {
        return false;
    }
}