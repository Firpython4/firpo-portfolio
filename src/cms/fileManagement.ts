import {type Dirent, promises as fileSystem} from "node:fs";
import path from "node:path";
import {collectionsPath, type PublicFolder, publicFolderValue} from "~/config";
import {  type StringWithInnerSubstring } from "~/typeSafety";
import {type Locale, locales} from "~/localization/localization";
import {promisify} from "util";
import sizeOf from "image-size";

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

export function getMarkdownFilesForLocales(directoryEntries: Dirent[])
{
    const files = new Map<Locale, Dirent>();
    for (const locale of locales)
    {
        const file = directoryEntries.find(file => file.name === `${locale}.md`);
        if (file)
        {
            files.set(locale, file);
        }
    }
    return files;
}

export const absoluteToRelativePath = (imagePath: PublicFolderPath) => (imagePath.split(path.join(publicFolderValue)))[1]! as PublicFolderPath;

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

const supportedImageFormats = [".png" as const, ".jpg" as const, ".jpeg" as const, ".webp" as const];
export type ImageExtension = typeof supportedImageFormats[number];

export function isImageExtension(extension: string): extension is ImageExtension
{
    return supportedImageFormats.includes(extension);
}

export type PublicFolderPath = StringWithInnerSubstring<PublicFolder>;

export function typeSafePathJoin<PathType extends string>(substringPath: StringWithInnerSubstring<PathType>, ...paths: string[])
{
    return path.join(substringPath, ...paths) as StringWithInnerSubstring<PathType>;
}

export async function importAsImage(imagePath: PublicFolderPath)
{
    for (const imageFormat of supportedImageFormats)
    {
        let relativePath: string | undefined = undefined;
        const asFormat = `${imagePath}${imageFormat}` as PublicFolderPath;
        if ((await exists(asFormat)))
        {
            relativePath = absoluteToRelativePath(asFormat);
            return relativePath;
        }
    }
}

export async function sizeOfAsync(input: string)
{
    return promisify(sizeOf)(input);
}