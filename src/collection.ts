import type { GetStaticPropsContext } from "next";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import { getAllCollections, getMarkdownFilesForLocales, readCollectionDirectory } from "./cms/fileManagement";
import { collectionsPath } from "./config";
import toContentObject from "./contentFormatting";
import { mapMap, mapMapAsync } from "./functional";
import { getPiecesWithLocale } from "./index";
import { type Locale, locales } from "./localization/localization";
import type { PieceType } from "./types/pieceType";
import type { Brand } from "./typeSafety";

export async function getCollectionsStaticPaths()
{
    const directories: string[] = (await getAllCollections())
    .filter((dirent) => dirent.isDirectory())
    .map((directory) => directory.name);
    
    const paths = locales.map(locale => directories.map(directoryName =>
                                                        {
                                                            return {
                                                                params: {
                                                                    collection: directoryName,
                                                                    locale: locale
                                                                }
                                                            };
                                                        })).flat();
    
    return {
        paths: paths,
        fallback: false
    };
}

export async function getCollectionProps(context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>): Promise<{
    props: { works: PieceType[]; content: { html: string; title: string } }
}>
{
    if (context.params && typeof (context.params.collection) === "string")
    {
        const collection = context.params.collection as CollectionId;
        
        const pieces = await getPiecesAsProps(collection, context.params.locale as Locale);
        const content = await getContent(collection);
        
        if (content)
        {
            const literalNewLine = "\\n";
            const newLineChar = "\r\n";
            return {
                props: {
                    content: mapMap(content, (locale, contentObject) =>
                    {
                        const titleWithNewLines = contentObject.title.replaceAll(literalNewLine, newLineChar);
                        return [locale, {
                            html: contentObject.html,
                            title: titleWithNewLines
                        }];
                    }).get(context.params.locale as Locale)!,
                    works: pieces
                }
            };
        }
        
        throw new Error("Invalid matter");
    }
    
    throw new Error("Unable to locate markdown file for content");
}

export type CollectionId = Brand<string, "collectionId">;

export async function getContent(collectionId: CollectionId)
{
    const directoryEntries = await readCollectionDirectory(collectionId);
    const content = getMarkdownFilesForLocales(directoryEntries)
    return await mapMapAsync(content, toContentObject);
}

export async function getPiecesAsProps(collectionId: CollectionId, locale: Locale)
{
    const directoryEntries = await readCollectionDirectory(collectionId);
    const directoriesWithParent = {
        path: path.join(process.cwd(), collectionsPath, collectionId),
        directoryEntities: directoryEntries,
        collectionId: collectionId
    }
    
    return (getPiecesWithLocale(locale))(directoriesWithParent);
}
