import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { z } from "zod";
import { error, ok, type Result } from "~/types/result";
import { type Brand } from "../typeSafety";
import { getExtension, getPath } from "./fileManagement";

type TCmsValue = TCmsImage
    | TCmsMarkdown
    | TCmsObject<Record<string, TCmsValue>>
    | TCmsUrl
    | TCmsArray<TCmsValue>
    | TCmsUnion<TCmsUnionOptions>

type TCmsEntity = {
    name: string
}

type Parser<OkType, ErrorType> = ((context: TCmsContext, relativePathPattern: Path) => Promise<Result<(OkType), (ErrorType)>>);
type CollectionParser<OkType, ErrorType> = ((context: TCmsContext, relativePathPattern: Path) => Promise<Result<(OkType), (ErrorType)>[]>);

type TCmsImage = {
    type: "image"
    parse: Parser<Image, "no matches">
}

type TCmsMarkdown = {
    type: "markdown"
    parse: Parser<Markdown, "no matches" | "invalid name">
}

interface TCmsObject<T extends Record<string, TCmsValue>> {
    type: "object";
    parse: Parser<Infer<TCmsObject<T>>, "no matches">
}

type TCmsUrl = {
    type: "url"
    parse: Parser<Url, "no matches" | "invalid url">
}

interface TCmsArray<ElementType extends TCmsValue> {
    type: "array";
    element: ElementType;
    parse: CollectionParser<Array<Infer<ElementType>>, "no matches">;
}

export declare type TCmsUnionOptions = Readonly<[...TCmsValue[]]>;

interface TCmsUnion<T extends TCmsUnionOptions> {
    type: "union";
    parse: Parser<InferTCmsUnion<T>, "no matches">
}

type Url = { type: "url", value: string } & TCmsEntity

type Markdown = { type: "markdown", path: Path } & TCmsEntity;
type Image = { type: "image", path: Path } & TCmsEntity;

type Infer<T extends TCmsValue> = T extends TCmsUrl ? Url
                                : T extends TCmsImage ? Image
                                : T extends TCmsMarkdown ? Markdown
                                : T extends TCmsObject<infer ObjectType> ? InferTCmsObject<ObjectType>
                                : T extends TCmsArray<infer ElementType> ? Array<Infer<ElementType>>
                                : T extends TCmsUnion<infer UnionType> ? InferTCmsUnion<UnionType>
                                : "invalid type";

type InferTCmsObject<T extends Record<string, TCmsValue>> = {
    [Key in keyof T]: Infer<T[Key]>;
};

type InferTCmsUnion<T extends TCmsUnionOptions> = Infer<T[number]>;

export type Path = Brand<string, "path">;

export async function getUrl(imageOrUrlPath: Path)
{
    return (await fileSystem.readFile(imageOrUrlPath)).toString();
}

export async function getUrlFromDirent(imageOrUrlPath: Dirent)
{
    return (await fileSystem.readFile(getPath(imageOrUrlPath))).toString();
}

function safeJoin(...pathSegments: Path[])
{
    return path.join(...pathSegments) as Path;
}

type TCmsContext = {
    basePath: Path,
    dirents: Dirent[]
}

const url = (): TCmsUrl => (
{
    type: "url",
    parse: async (context: TCmsContext, relativePathPattern: Path) => {
        const dirent = context.dirents.find(value => value.name.match(relativePathPattern))
        if (!dirent)
        {
            return error("no matches" as const);
        }

        const url = await getUrlFromDirent(dirent);
        
        if (!z.string().url().safeParse(url))
        {
            return error("invalid url" as const);
        }
        
        return ok({
            type: "url",
            name: dirent.name.replace(getExtension(dirent), ""),
            value: url,
        });
    }
}
);

const markdown = <T extends string>(name?: T): TCmsMarkdown => (
{
    type: "markdown",
    parse: promisify((context: TCmsContext, relativePathPattern: Path) => {
        const dirent = context.dirents.find(value => value.name.match(relativePathPattern))
        if (!dirent)
        {
            return error("no matches" as const);
        }
        
        const foundName = dirent.name.replace(getExtension(dirent), "");
        if (name && name !== foundName)
        {
            return error("invalid name" as const)
        }
        
        //TODO: test extension
        
            return ok({
                                  type: "markdown",
                                  foundName,
                                  path: safeJoin(context.basePath, relativePathPattern),
                              });
    })
});

const image = (): TCmsImage => ({
    type: "image",
    parse: promisify((context: TCmsContext, relativePathPattern: Path) => {
        const dirent = context.dirents.find(value => value.name.match(relativePathPattern))
        if (!dirent)
        {
            return error("no matches" as const);
        }
        
        //TODO: test extension
        
        return ok({
                      type: "image",
                      name: dirent.name.replace(getExtension(dirent), ""),
                      path: safeJoin(context.basePath, relativePathPattern),
                  });
    })
});

const array = <ElementType extends TCmsValue>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    element: element,
    async parse(context, relativePath)
    {
        const results = context.dirents.map(async dirent =>
                                                                             {
                                                                                 return await element.parse(context, relativePath);
                                                                             });
        
        return results;
    }
});

const object = <T extends Record<string, TCmsValue>>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
    async parse(context, relativePath) {

        const result = await Promise.all(Object.entries(fields).map(async ([, value]) =>
                                                       {
                                                           return value.parse(context, relativePath);
                                                       }));
        
        return ok(result as InferTCmsObject<typeof fields>);
    },
});

const union = <T extends TCmsUnionOptions>(...types: T): TCmsUnion<typeof types> => ({
    type: "union",
    async parse(context: TCmsContext, relativePath: Path)
    {
        for (const option of types)
        {
            try
            {
                return await option.parse(context, relativePath);
            }
            catch (error)
            {
                // Ignore errors and try the next type
            }
        }
        
        return error("None of the union types matched");
    }
});

export const tcms = {
    url,
    markdown,
    image,
    array,
    object
};

const videoWithThumb = object({video: url(), thumbnail: image()})
const video = url();
const piece = union(video, videoWithThumb, image());
const pieces = array(piece);
const collection = object({ pieces: pieces, pt: markdown("pt")});
const testSchema = array(collection);
