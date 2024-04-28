import { type Dirent } from "node:fs";
import path from "node:path";
import {
    absoluteToRelativePath,
    exists,
    getAllCollections,
    getExtension,
    getMarkdownFilesForLocales,
    getPath,
    getCollectionsFromDirectories,
    getVideoUrl,
    importAsImage,
    isImageExtension,
    type PublicFolderPath,
    removeExtension,
    sizeOfAsync,
    typeSafePathJoin
} from "~/cms/fileManagement";
import { type PublicFolder, publicFolderValue } from "~/config";
import { type LocalizedText } from "~/localization/localization";
import { promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper } from "~/promises/promisePredicates";
import { type UniqueCollectionType } from "../types/localizedCollectionType";
import { type PieceSharedType, type PieceType } from "~/types/pieceType";
import { type Brand, includesInner } from "~/typeSafety";
import toContentObject from "../contentFormatting";
import { mapMap, mapMapAsync } from "../functional";

async function asImage(mediaDirent: Dirent, shared: PieceSharedType<LocalizedText>)
{
    const piecePath = getPath(mediaDirent);
    const extension = path.extname(piecePath);
    if (includesInner(piecePath, "public"))
    {
        if (isImageExtension(extension))
        {
            const size = await sizeOfAsync(piecePath);
            if (!size)
            {
                throw new Error(`Unable to read file ${piecePath}`)
            }
            if (!size.width)
            {
                throw new Error(`Invalid image width for ${piecePath}`)
            }
            if (!size.height)
            {
                throw new Error(`Invalid image height for ${piecePath}`)
            }
            return {
                type: "image" as const,
                url: absoluteToRelativePath(piecePath),
                title: mediaDirent.name.replace(getExtension(mediaDirent), ""),
                width: size.width,
                height: size.height,
                ...shared
            };
        }
    }
}

async function asVideo(mediaDirent: Dirent, shared: PieceSharedType<LocalizedText>)
{
    const piecePath = getPath(mediaDirent);
    const extension = path.extname(piecePath);
    if (includesInner(piecePath, publicFolderValue))
    {
        if (extension === ".url")
        {
            return {
                type: "video" as const,
                url: await getVideoUrl(piecePath),
                title: mediaDirent.name.replace(getExtension(mediaDirent), ""),
                ...shared
            };
        }
    }
}

async function asVideoWithThumbnail(mediaDirent: Dirent, shared: PieceSharedType<LocalizedText>)
{
    const piecePath = getPath(mediaDirent);
    const videoUrlPath = path.join(piecePath, `${removeExtension(mediaDirent)}.url`)
    if (includesInner(piecePath, publicFolderValue) && includesInner(videoUrlPath, publicFolderValue))
    {
        if (await (exists(videoUrlPath)))
        {
            const imagePathNoExtension = typeSafePathJoin<PublicFolder>(piecePath, removeExtension(mediaDirent));
            const thumbnail = await importAsImage(imagePathNoExtension);
            if (!thumbnail)
            {
                return undefined;
            }

            const size = await sizeOfAsync(thumbnail.absolutePath);
            if (!size || !size.height || !size.width)
            {
                return undefined;
            }
            return {
                type: "videoWithThumbnail" as const,
                url: await getVideoUrl(videoUrlPath),
                thumbnail: {
                    url: thumbnail.relativePath,
                    width: size.width,
                    height: size.height
                },
                title: mediaDirent.name,
                ...shared
            };
        }
    }
}

const replaceNewlines = (text: string) =>
{
    const literalNewLine = "\\n";
    const newLineChar = "\n";
    return text.replace(literalNewLine, newLineChar);
};

function getPiece(parentDirectoryPath: PublicFolderPath, collectionId: CollectionId, collectionName: LocalizedText)
{
    type PieceProvider = (mediaDirent: Dirent, shared: PieceSharedType<LocalizedText>, parentDirectoryPath: PublicFolderPath, collectionId: CollectionId) => Promise<PieceType<LocalizedText> | undefined>;
    const providers: PieceProvider[] = [asImage, asVideo, asVideoWithThumbnail]
    return async (mediaDirent: Dirent) =>
    {
        const link: string = absoluteToRelativePath(parentDirectoryPath).replaceAll("\\", "/");
        const shared = {
            linkToCollection: link,
            collectionName: collectionName
        };
        
        for (const provider of providers)
        {
            const piece = await provider(mediaDirent, shared, parentDirectoryPath, collectionId);
            if (piece)
            {
                return piece;
            }
        }
        
        throw new Error(`Unsupported file format: ${getPath(mediaDirent)}`)
    };
}

type CollectionDirectoryType = {
    path: string,
    directoryEntities: Dirent[],
    id: CollectionId
};

function isMarkdownFile(dirent: Dirent)
{
    if (!dirent.isFile())
    {
        return false;
    }
    
    return path.extname(getPath(dirent)) === ".md";
}

async function getCollectionWithPiecesAndContent(collectionDirectory: CollectionDirectoryType)
{
    const id = collectionDirectory.id;
    const content = await getContentFromDirectory(collectionDirectory.directoryEntities);
    const collectionName = mapMap(content ,(key, value) => [key, replaceNewlines(value.title)]);

    const result = await getPiecesFromCollection(collectionDirectory, id, collectionName);
    
    const promiseRejectedResults = result.filter(promiseRejectedPredicate);
    if (promiseRejectedResults.length > 0)
    {
        console.warn(`Some pieces were unable to be rendered due to missing localizations: ${JSON.stringify(promiseRejectedResults)}`)
    }
    
    const pieces = result.filter(promiseFullfilledPredicate)
                                    .map(valueMapper);

    return { id, pieces, content };
}

async function getPiecesFromCollection(collectionDirectory: CollectionDirectoryType, id: CollectionId, collectionName: LocalizedText)
{
    if (includesInner(collectionDirectory.path, publicFolderValue))
    {
        return await Promise.allSettled(collectionDirectory.directoryEntities
                                        .filter(dirent => !isMarkdownFile(dirent))
                                        .map(getPiece(collectionDirectory.path, id, collectionName)));
    }
    else
    {
        throw new Error(`${collectionDirectory.path} is not located in public`)
    }
}

async function compileCms()
{
    const directoryEntries = await getAllCollections();
    const directories = directoryEntries.filter(dirent => dirent.isDirectory())
    const subDirectories = await Promise.allSettled(getCollectionsFromDirectories(directories));
    const fulfilledSubdirectories = subDirectories.filter(promiseFullfilledPredicate)
                                                                         .map(valueMapper);
    const rejectedSubdirectories = subDirectories.filter(promiseRejectedPredicate);
    
    if (rejectedSubdirectories.length > 0)
    {
        throw new Error(`Some subdirectory reads failed: ${rejectedSubdirectories.toString()}`)
    }
    
    const collectionsWithPieces = await Promise.allSettled(fulfilledSubdirectories.map(getCollectionWithPiecesAndContent));
    const promiseRejectedResults = collectionsWithPieces.filter(promiseRejectedPredicate);
    if (promiseRejectedResults.length > 0)
    {
        throw new Error(`Some pieces failed to resolve: ${JSON.stringify(promiseRejectedResults)}`)
    }
    
    const map = new Map<CollectionId, UniqueCollectionType>();
    
    const array = collectionsWithPieces.filter(promiseFullfilledPredicate).map(valueMapper);
    
    array.forEach(collection => map.set(collection.id, collection))

    return { map, array };
}

export type CollectionId = Brand<string, "collectionId">;

async function getContentFromDirectory(directoryEntries: Dirent[])
{
    const content = getMarkdownFilesForLocales(directoryEntries);
    return await mapMapAsync(content, toContentObject);
}

async function getOrCacheCompiledCms()
{
    if (!cachedCms)
    {
        cachedCms = await compileCms();
    }

    return cachedCms;
}

type ContentManagementSystem = {
    map: Map<CollectionId, UniqueCollectionType>,
    array: UniqueCollectionType[]
}
let cachedCms: ContentManagementSystem | null;

export default getOrCacheCompiledCms;