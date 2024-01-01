import {includesInner, type StringWithInnerSubstring} from "~/typeSafety";
import {type PublicFolder, publicFolderValue} from "~/config";
import {type Dirent, promises as fileSystem} from "node:fs";
import {
    absoluteToRelativePath,
    getExtension,
    getFirstMarkdownFile,
    getPath, getSubdirectories,
    getVideoUrl, getWorksDirectoryEntities,
    isFile, isImage, isVideoUrl, isVideoWithThumbnail
} from "~/cms/fileManagement";
import path from "node:path";
import matter from "gray-matter";
import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";
import {orderByConfig} from "~/cms/ordering";
import {type PieceSharedType, type PieceType} from "~/types/pieceType";

function replaceNewLineWithNewLineLiterals(collectionTitle: string)
{
    return collectionTitle.replace("\\n", "\n");
}

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
        else
        {
            throw new Error(`Unsupported file format: ${piecePath}`)
        }
    }
}


function getPiece(parentDirectoryPath: StringWithInnerSubstring<PublicFolder>, collectionTitle: string)
{
    type PieceProvider = (mediaDirent: Dirent, shared: PieceSharedType, parentDirectoryPath: StringWithInnerSubstring<PublicFolder>, collectionTitle: string) => Promise<PieceType | undefined>;
    const providers: PieceProvider[] = [asImage, asVideo]
    return async (mediaDirent: Dirent) =>
    {
        const link: string = absoluteToRelativePath(parentDirectoryPath).replaceAll("\\", "/");
        const shared = {
            linkToCollection: link,
            collectionTitle: replaceNewLineWithNewLineLiterals(collectionTitle),
        };
        for (const provider of providers)
        {
            const piece = await provider(mediaDirent, shared, parentDirectoryPath, collectionTitle);
            if (piece)
            {
                return piece;
            }
        }
        
        throw new Error(`Unsupported file format: ${getPath(mediaDirent)}`)
    };
}

function isPiece(dirent: Dirent)
{
    return isImage(dirent) || isVideoUrl(dirent) || isVideoWithThumbnail(dirent);
}

async function getPieces(subCollection: { parent: Dirent, sub: Dirent[] })
{
    const parentDirectoryPath = getPath(subCollection.parent);
    if (includesInner(parentDirectoryPath, publicFolderValue))
    {
        const firstMarkdownFileDirent = getFirstMarkdownFile(subCollection.sub);
        if (firstMarkdownFileDirent)
        {
            const firstMarkdownFile = firstMarkdownFileDirent.name;
            const contentFile = await fileSystem.readFile(getPath(firstMarkdownFileDirent));
            const matterResult = matter(contentFile).data.title as unknown;
            if (typeof(matterResult) === "string")
            {
                const literalNewLine = "\\r\\n";
                const newLineChar = "\n";
                const result = await Promise.allSettled(subCollection.sub.filter(isFile)
                    .filter(isPiece)
                    .map(getPiece(parentDirectoryPath, matterResult.replaceAll(literalNewLine, newLineChar))));

                return result.filter(promiseFullfilledPredicate).map(valueMapper);

            }

            throw new Error(`Wrong matter format in ${firstMarkdownFile}`)
        }
        else
        {
            throw new Error(`Unable to find first markdown file at ${subCollection.sub.toString()}`)
        }
    }
    else
    {
        throw new Error(`${parentDirectoryPath} is not located in public`)
    }
}

export async function getIndexProps()
{
    const directoryEntries = await getWorksDirectoryEntities();
    const directories = directoryEntries.filter(dirent => dirent.isDirectory())
    const subDirectories = await Promise.allSettled(getSubdirectories(directories));
    const fulfilledSubdirectories = subDirectories.filter(promiseFullfilledPredicate).map(promise => promise.value);
    const rejectedSubdirectories = subDirectories.filter(promiseRejectedPredicate);

    if (rejectedSubdirectories.length > 0)
    {
        throw new Error(`Some subdirectory reads failed: ${rejectedSubdirectories.toString()}`)
    }

    const piecePromises = await Promise.allSettled(fulfilledSubdirectories.map(getPieces));
    const promiseRejectedResults = piecePromises.filter(promiseRejectedPredicate);
    if (promiseRejectedResults.length > 0)
    {
        throw new Error(`Some pieces failed to resolve: ${JSON.stringify(promiseRejectedResults)}`)
    }

    const pieces = piecePromises.filter(promiseFullfilledPredicate).map(valueMapper).flat();

    await orderByConfig(pieces);

    return {
        props: {
            pieces: pieces
        }
    }
}


