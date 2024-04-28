import { promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { z } from "zod";
import { error, ok, type Result } from "~/types/result";
import { type Brand } from "../typeSafety";
import { getExtension, getPath } from "./fileManagement";
import { readdir } from "node:fs/promises";

type TCmsValue<Value> = {readonly output: Value, readonly parse: Parser<Value, unknown>} & (TCmsImage | TCmsUrl | TCmsUnion<[...TCmsValue<unknown>[]]> | TCmsArray<TCmsValue<unknown>> | TCmsObject<Record<string, TCmsValue<unknown>>>);

type TCmsEntity = {
    name: string
}

type Parser<OkType, ErrorType> = ((path: Path) => Promise<Result<OkType, ErrorType>>);

type TCmsImage = {
    readonly type: "image";
    readonly output: Image;
    readonly error: "no matches" | "image not in the configured folder";
    readonly parse: Parser<TCmsImage["output"], TCmsImage["error"]>
}

type TCmsMarkdown = {
    readonly type: "markdown";
    readonly output: Markdown;
    readonly error: "no matches" | "invalid name";
    readonly parse: Parser<TCmsMarkdown["output"], TCmsMarkdown["error"]>
}

interface TCmsObject<T extends Record<string, TCmsValue<unknown>>> {
    readonly type: "object";
    readonly output: InferTCmsObject<T>;
    readonly error: "no matches";
    readonly parse: Parser<TCmsObject<T>["output"], TCmsObject<T>["error"]>
}

type TCmsUrl = {
    readonly type: "url";
    readonly output: Url;
    readonly error: "no matches" | "invalid url";
    readonly parse: Parser<TCmsUrl["output"], TCmsUrl["error"]>
}

interface TCmsArray<ElementType extends TCmsValue<unknown>> {
    readonly type: "array";
    //@ts-expect-error type inference is expected to get deep
    readonly output: ElementType["output"][]
    readonly error: "no matches";
    readonly parse: Parser<TCmsArray<ElementType>["output"], TCmsArray<ElementType>["error"]>;
}

interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown>[]]>> {
    readonly type: "union";
    readonly output: InferTCmsUnion<T>;
    readonly error: "no matches";
    readonly parse: Parser<TCmsUnion<T>["output"], TCmsUnion<T>["error"]>
}

type Url = { type: "url", value: string } & TCmsEntity

type Markdown = { type: "markdown", path: Path } & TCmsEntity;
type Image = { type: "image", path: `${string}public/${string}` } & TCmsEntity;
export type Path = Brand<string, "path">;


type InferTCmsObject<T extends Record<string, TCmsValue<unknown>>> = {
    [Key in keyof T]: Infer<T[Key]>;
};

type ArrayIndices<T extends Readonly<[...TCmsValue<unknown>[]]>> = Exclude<keyof T, keyof Array<unknown>>;

type InferTCmsUnion<T extends Readonly<[...TCmsValue<unknown>[]]>> = {
    [Key in ArrayIndices<T>]: {
        option: Key, // @ts-expect-error TS does not recognize string indices as real indices
        value: T[Key]["output"]}
}[ArrayIndices<T>]

export type Infer<T extends TCmsValue<unknown>> =  T["output"];


export async function getUrl(imageOrUrlPath: Path)
{
    return (await fileSystem.readFile(imageOrUrlPath)).toString();
}

export async function getUrlFromPath(path: Path)
{
    return (await fileSystem.readFile(path)).toString();
}

declare const defaultUrl: Url;
declare const err: "invalid url" | "no matches";
const url = (): TCmsUrl => (
{
    type: "url",
    output: defaultUrl,
    error: err,
    parse: async path => {
        const extension = ".url";
        if (!path.endsWith(extension))
        {
            return error("invalid extension");
        }
        
        const url = await getUrlFromPath(path);
        
        if (!z.string().url().safeParse(url))
        {
            return error("invalid url");
        }
        
        return ok({
            type: "url",
            name: getExtension(path),
            value: url,
        });
    }
});
    

declare const markdownDefault: Markdown;

const markdown = <T extends string>(namePattern?: T): TCmsMarkdown => (
{
    type: "markdown",
    output: markdownDefault,
    error: "no matches",
    parse: promisify((path: Path) => {
        const extension = ".md";
        if (!path.endsWith(extension))
        {
            return error("invalid extension");
        }

        if (namePattern && !path.match(namePattern))
        {
            return error("invalid name");
        }

        return ok({
            type: "markdown",
            name: getName(path),
            value: url,
        });
    })
});

declare const defaultImage: Image;
const image = (): TCmsImage => ({
    type: "image",
    output: defaultImage,
    error: "no matches",
    parse: promisify((path: Path) => {
        const extensions = [".jpg", ".webp", ".png", ".svg", ".ico"];
        const split = path.split(".");
        const extension = split[split.length - 1];
        if (!extension
         || extensions.includes(extension))
        {
            return error("invalid extension");
        }
        
        const url = path.split(imageFolder)[1];

        if (!url)
        {
            return error("image is not in the configured folder")
        }

        return ok({
            type: "url",
            name: getName(path),
            url: url as `${string}public/${string}`
        });
    })
});

function getName(inPath: Path)
{
    const split = inPath.split(path.delimiter);
    
    const name = split[split.length - 1];
    if (!name)
    {
        return inPath;
    }

    return name;
}

declare function makeDefaultArray<T extends TCmsValue<unknown>>(element: T): Infer<T>[];
const array = <ElementType extends TCmsValue<unknown>>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    output: makeDefaultArray(element),
    error: "no matches",
    async parse(path: Path)
    {
        const dirents = await readdir(path, {withFileTypes: true});
        const mapped = await Promise.all(dirents.map(async dirent => (await element.parse(getPath(dirent)))));
        const filtered = mapped.filter(parsed => parsed.wasResultSuccessful);
        return ok(filtered);
    }
});

declare function makeDefaultObject<T extends Record<string, TCmsValue<unknown>>>(fields: T): InferTCmsObject<T>
const object = <T extends Record<string, TCmsValue<unknown>>>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
    error: "no matches",
    output: makeDefaultObject(fields),
    async parse(path: Path) {
        const dirents = await readdir(path, {withFileTypes: true});
        const result = await Promise.all(Object.entries(fields).map(async ([, value]) =>
                                                       {
                                                            for (const dirent of dirents)
                                                            {
                                                                const parsed = await value.parse(getPath(dirent));
                                                                if (parsed.wasResultSuccessful)
                                                                {
                                                                    return parsed;
                                                                }
                                                            }

                                                            return error("no matches");
                                                       }));
        
        if (result.find(value => !value.wasResultSuccessful))
        {
            return error("no matches");
        }

        return ok(result as TCmsObject<T>["output"]);
    },
});

declare function makeDefaultUnion<T extends Readonly<[...TCmsValue<unknown>[]]>>(...types: T): InferTCmsUnion<T>;
const union = <T extends Readonly<[...TCmsValue<unknown>[]]>>(...types: T): TCmsUnion<T> => ({
    type: "union",
    error: "no matches",
    output: makeDefaultUnion<T>(...types),
    async parse(path: Path)
    {
        for (const [option, type] of types.entries())
        {
            try
            {
                const typeSafeIndex = option as ArrayIndices<T>;

                // @ts-expect-error TS does not recognize string indices as real indices
                const parseResult = (await type.parse(path)) as T[ArrayIndices<T>]["output"]
                return ok({
                    option: typeSafeIndex,
                    value: parseResult
                }) 
            }
            catch (error)
            {
                // Ignore errors and try the next type
            }
        }
        
        return error("no matches");
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
const schema = union(image(), video, union(image(), url(), videoWithThumb));

type g = Infer<typeof schema>;
declare const hg: g;
if (hg.option === "2")
{
    const result = hg.value
    if (result.option === "2")
    {
        const gr = result.value.thumbnail;
    }
}

export function safePath(path: string)
{
    return path as Path;
}

export function relativePath(relativePath: Path)
{
    return path.join(process.cwd(), relativePath);
}

const imageFolder = "public";