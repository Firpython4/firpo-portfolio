import { type Dirent } from "node:fs";
import {includesInner, type StringWithInnerSubstring} from "~/typeSafety";
import {type PublicFolder, publicFolderValue} from "~/config";
import {
    absoluteToRelativePath, exists,
    getExtension,
    getPath, getSubdirectories,
    getVideoUrl, getAllCollections,
    removeExtension
} from "~/cms/fileManagement";
import path from "node:path";
import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";
import {orderByConfig} from "~/cms/ordering";
import {type PieceSharedType, type PieceType} from "~/types/pieceType";
import { type Locale, useLocalizedContent } from "~/localization/localization";
import { type CollectionId, getContent } from "./collection";

async function asImage(mediaDirent: Dirent, shared: PieceSharedType)
{
    const piecePath = getPath(mediaDirent);
    const extension = path.extname(piecePath);
    if (includesInner(piecePath, "public"))
    {
        if (extension === ".png" || extension === ".jpg")
        {
            return {
                type: "image" as const,
                url: absoluteToRelativePath(piecePath),
                title: mediaDirent.name.replace(getExtension(mediaDirent), ""),
                ...shared
            };
        }
    }
}

async function asVideo(mediaDirent: Dirent, shared: PieceSharedType)
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

async function asVideoWithThumbnail(mediaDirent: Dirent, shared: PieceSharedType)
{
    const piecePath = getPath(mediaDirent);
    const videoUrlPath = path.join(piecePath, `${removeExtension(mediaDirent)}.url`)
    const pngThumbnailPath = path.join(piecePath, `${removeExtension(mediaDirent)}.png`)
    const jpgThumbnailPath = path.join(piecePath, `${removeExtension(mediaDirent)}.jpg`)
    if (includesInner(piecePath, publicFolderValue) && includesInner(videoUrlPath, publicFolderValue))
    {
        if (await (exists(videoUrlPath)))
        {
            let thumbnailUrl: string | undefined = undefined;
            if ((await exists(pngThumbnailPath)) && includesInner(pngThumbnailPath, publicFolderValue))
            {
                thumbnailUrl = absoluteToRelativePath(pngThumbnailPath);
            }
            if ((await (exists(jpgThumbnailPath))) && includesInner(jpgThumbnailPath, publicFolderValue))
            {
                thumbnailUrl = absoluteToRelativePath(jpgThumbnailPath);
            }
            if (!thumbnailUrl)
            {
                return undefined;
            }
            return {
                type: "videoWithThumbnail" as const,
                url: await getVideoUrl(videoUrlPath),
                thumbnailUrl: thumbnailUrl,
                title: mediaDirent.name,
                ...shared
            };
        }
    }
}

function getPiece(parentDirectoryPath: StringWithInnerSubstring<PublicFolder>, collectionId: CollectionId, locale: Locale)
{
    type PieceProvider = (mediaDirent: Dirent, shared: PieceSharedType, parentDirectoryPath: StringWithInnerSubstring<PublicFolder>, collectionId: CollectionId) => Promise<PieceType | undefined>;
    const providers: PieceProvider[] = [asImage, asVideo, asVideoWithThumbnail]
    return async (mediaDirent: Dirent) =>
    {
        const link: string = absoluteToRelativePath(parentDirectoryPath).replaceAll("\\", "/");
        const literalNewLine = "\\n";
        const newLineChar = "\n";
        const shared = {
            linkToCollection: link,
            collectionName: useLocalizedContent(await getContent(collectionId), locale).title.replace(literalNewLine, newLineChar)
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

type SubcollectionType = { path: string, directoryEntities: Dirent[], collectionId: CollectionId };

export function getPiecesWithLocale(locale: Locale)
{
    return async (subCollection: SubcollectionType) =>
    {
        if (includesInner(subCollection.path, publicFolderValue))
        {
            const result = await Promise.allSettled(subCollection.directoryEntities
                .map(getPiece(subCollection.path, subCollection.collectionId, locale)));

            return result.filter(promiseFullfilledPredicate).map(valueMapper);
        }
        else
        {
            throw new Error(`${subCollection.path} is not located in public`)
        }
    }
}

export async function getIndexProps(locale: Locale)
{
    const directoryEntries = await getAllCollections();
    const directories = directoryEntries.filter(dirent => dirent.isDirectory())
    const subDirectories = await Promise.allSettled(getSubdirectories(directories));
    const fulfilledSubdirectories = subDirectories.filter(promiseFullfilledPredicate).map(valueMapper).map(value =>
    {
        const collectionId = value.path.split(`collections${path.sep}`)[1]!;
        return {
            collectionId: collectionId as CollectionId,
            ...value
        }
    });
    const rejectedSubdirectories = subDirectories.filter(promiseRejectedPredicate);

    if (rejectedSubdirectories.length > 0)
    {
        throw new Error(`Some subdirectory reads failed: ${rejectedSubdirectories.toString()}`)
    }

    const piecePromises = await Promise.allSettled(fulfilledSubdirectories.map(getPiecesWithLocale(locale)));
    const promiseRejectedResults = piecePromises.filter(promiseRejectedPredicate);
    if (promiseRejectedResults.length > 0)
    {
        throw new Error(`Some pieces failed to resolve: ${JSON.stringify(promiseRejectedResults)}`)
    }

    const pieces = piecePromises.filter(promiseFullfilledPredicate).map(valueMapper).flat();

    await orderByConfig(pieces);

    return {
        props: {
            pieces: pieces,
            locale: locale
        }
    }
}


