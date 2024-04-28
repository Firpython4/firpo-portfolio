import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { z } from "zod";
import { error, ok } from "~/types/result";
import { type Brand } from "../typeSafety";
import { getExtension, getPath } from "./fileManagement";

type TCmsValue<Value> = {readonly output: Value, readonly parse: Parser<Value>} & (TCmsImage | TCmsUrl | TCmsUnion<[...TCmsValue<unknown>[]]> | TCmsArray<TCmsValue<unknown>> | TCmsObject<Record<string, TCmsValue<unknown>>>);

type TCmsEntity = {
    name: string
}

type Parser<OkType> = ((context: TCmsContext, relativePathPattern: Path) => Promise<OkType>);

type TCmsImage = {
    readonly type: "image";
    readonly output: Image;
    readonly error: "no matches";
    readonly parse: Parser<TCmsImage["output"]>
}

type TCmsMarkdown = {
    readonly type: "markdown";
    readonly output: Markdown;
    readonly error: "no matches" | "invalid name";
    readonly parse: Parser<TCmsMarkdown["output"]>
}

interface TCmsObject<T extends Record<string, TCmsValue<unknown>>> {
    readonly type: "object";
    readonly output: InferTCmsObject<T>;
    readonly error: "no matches";
    readonly parse: Parser<TCmsObject<T>["output"]>
}

type TCmsUrl = {
    readonly type: "url";
    readonly output: Url;
    readonly error: "no matches" | "invalid url";
    readonly parse: Parser<TCmsUrl["output"]>
}

interface TCmsArray<ElementType extends TCmsValue<unknown>> {
    readonly type: "array";
    //@ts-expect-error Since the user can nest schemas, it's expected for the following line to throw an error in regard to the type instantiation limit
    readonly output: ElementType["output"][]
    readonly error: "no matches";
    readonly parse: Parser<TCmsArray<ElementType>["output"]>;
}

interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown>[]]>> {
    readonly type: "union";
    readonly output: InferTCmsUnion<T>;
    readonly error: "no matches";
    readonly parse: Parser<TCmsUnion<T>["output"]>
}

type Url = { type: "url", value: string } & TCmsEntity

type Markdown = { type: "markdown", path: Path } & TCmsEntity;
type Image = { type: "image", path: Path } & TCmsEntity;
export type Path = Brand<string, "path">;


type InferTCmsObject<T extends Record<string, TCmsValue<unknown>>> = {
    [Key in keyof T]: Infer<T[Key]>;
};

type InferTCmsUnion<T extends Readonly<[...TCmsValue<unknown>[]]>> = T[number]["output"];

type test = InferTCmsUnion<[TCmsUrl, TCmsArray<TCmsImage>]>

type Infer<T extends TCmsValue<unknown>> =  T["output"];


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

declare const defaultUrl: Url;
declare const err: "invalid url" | "no matches";
const url = (): TCmsUrl => (
{
    type: "url",
    output: defaultUrl,
    error: err,
    parse: async (context: TCmsContext, relativePathPattern: Path) => {
        const dirent = context.dirents.find(value => value.name.match(relativePathPattern))
        if (!dirent)
        {
            throw new Error();
        }

        const url = await getUrlFromDirent(dirent);
        
        z.string().url().parse(url);
        
        return ok({
            type: "url",
            name: dirent.name.replace(getExtension(dirent), ""),
            value: url,
        });
    }
}
);

declare const markdownDefault: Markdown;
declare const noMatches: "no matches";

const markdown = <T extends string>(name?: T): TCmsMarkdown => (
{
    type: "markdown",
    output: markdownDefault,
    error: "no matches",
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

declare const defaultImage: Image;
const image = (): TCmsImage => ({
    type: "image",
    output: defaultImage,
    error: "no matches",
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

declare function makeDefault<T extends TCmsValue<unknown>>(element: T): Infer<T>;
const array = <ElementType extends TCmsValue<unknown>>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    output: makeDefault(element),
    error: "no matches",
    async parse(context, relativePath)
    {
        const map = await Promise.all(context.dirents.map(async dirent =>
        {
            return await element.parse(context, relativePath);
        }));
        
        return map;
    }
});

declare function makeDefaultObject<T extends Record<string, TCmsValue<unknown>>>(fields: T): InferTCmsObject<T>
const object = <T extends Record<string, TCmsValue<unknown>>>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
    error: "no matches",
    output: makeDefaultObject(fields),
    async parse(context, relativePath) {

        const result = await Promise.all(Object.entries(fields).map(async ([, value]) =>
                                                       {
                                                           return value.parse(context, relativePath);
                                                       }));
        
        return ok(result as TCmsObject<T>["output"]);
    },
});

declare function makeDefaultUnion<T extends Readonly<[...TCmsValue<unknown>[]]>>(...types: T): InferTCmsUnion<T>;
const union = <T extends Readonly<[...TCmsValue<unknown>[]]>>(...types: T): TCmsUnion<T> => ({
    type: "union",
    error: "no matches",
    output: makeDefaultUnion(...types),
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
        
        throw new Error();
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
const schema = union(videoWithThumb, video);

type g = Infer<typeof schema>;

