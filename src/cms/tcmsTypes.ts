import { promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { z } from "zod";
import { error, type ExtractErrorType, type ExtractOkType, ok, type Result } from "~/types/result";
import { type Brand } from "../typeSafety";
import { getExtension, getPath, sizeOfAsync } from "./fileManagement";
import { readdir } from "node:fs/promises";

type TCmsValue<Value, Error> = {
    readonly parse: Parser<Value, Error>
} & (
    TCmsImage
  | TCmsMarkdown
  | TCmsUrl
  | TCmsUnion<[...TCmsValue<unknown, unknown>[]]>
  | TCmsArray<TCmsValue<unknown, unknown>>
  | TCmsObject<Record<string, TCmsValue<unknown, unknown>>>);

type TCmsEntity = {
    name: string
}

type Parser<OkType, ErrorType> = ((path: Path) => Promise<Result<OkType, ErrorType>>);

type ImageError = "no matches" | "image not in the configured folder";
type TCmsImage = {
    readonly type: "image";
    readonly parse: Parser<Image, ImageError>
}

type MarkdownError = "no matches" | "invalid name";
type TCmsMarkdown = {
    readonly type: "markdown";
    readonly parse: Parser<Markdown, MarkdownError>
}

interface TCmsObject<T extends Record<string, TCmsValue<unknown, unknown>>> {
    readonly type: "object";
    readonly parse: Parser<InferTCmsObject<T>, "no matches">
}

type UrlError = "no matches" | "invalid url";

type TCmsUrl = {
    readonly type: "url";
    readonly parse: Parser<Url, UrlError>
}

interface TCmsArray<ElementType extends TCmsValue<unknown, unknown>> {
    readonly type: "array";
    //@ts-expect-error type inference is expected to get deep
    readonly parse: Parser<Infer<ElementType>[], "empty array">;
}

interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> {
    readonly type: "union";
    readonly parse: Parser<InferTCmsUnion<T>, "no matches">
}

type Url = { type: "url", value: string } & TCmsEntity

type Markdown = { type: "markdown", path: Path } & TCmsEntity;
type Image = {
    type: "image",
    url: `${string}${typeof imageFolder}/${string}`
    width: number,
    height: number
} & TCmsEntity;
export type Path = Brand<string, "path">;


type InferTCmsObject<T extends Record<string, TCmsValue<unknown, unknown>>> = {
    [Key in keyof T]: Infer<T[Key]>;
};

type ArrayIndices<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = Exclude<keyof T, keyof Array<unknown>>;

type InferTCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = {
    [Key in ArrayIndices<T>]: {
        option: Key, // @ts-expect-error TS does not recognize string indices as real indices
        value: Infer<T[Key]>}
}[ArrayIndices<T>]

export type Infer<T extends TCmsValue<unknown, unknown>> =  ExtractOkType<Awaited<ReturnType<T["parse"]>>>;
export type InferError<T extends TCmsValue<unknown, unknown>> =  ExtractErrorType<Awaited<ReturnType<T["parse"]>>>;


export async function getUrl(imageOrUrlPath: Path)
{
    return (await fileSystem.readFile(imageOrUrlPath)).toString();
}

export async function getUrlFromPath(path: Path)
{
    return (await fileSystem.readFile(path)).toString();
}

const url = (): TCmsUrl => (
{
    type: "url",
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
    


const markdown = <T extends string>(namePattern?: T): TCmsMarkdown => (
{
    type: "markdown",
    parse: promisify((path: Path) => {
        const extension = ".md";
        if (!path.endsWith(extension))
        {
            return error("invalid extension");
        }
        
        const name = getName(path);
        if (namePattern && !name.match(namePattern))
        {
            return error("invalid name");
        }

        return ok({
            type: "markdown",
            name,
            value: url,
        });
    })
});

const image = (): TCmsImage => ({
    type: "image",
    parse: async (path: Path) => {
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

        const size = await sizeOfAsync(path);

        if (!size)
        {
            return error(`Unable to read file ${path}`)
        }
        if (size.width === undefined)
        {
            return error(`Invalid image width for ${path}`)
        }
        if (size.height === undefined)
        {
            return error(`Invalid image height for ${path}`)
        }

        return ok({
            type: "image",
            name: getName(path),
            width: size.width,
            height: size.height,
            url: url as `${string}${typeof imageFolder}/${string}`
        });
    }
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

const array = <ElementType extends TCmsValue<unknown, unknown>>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    async parse(path: Path)
    {
        const dirents = await readdir(path, {withFileTypes: true});
        const mapped = await Promise.all(dirents.map(async dirent => (await element.parse(getPath(dirent)))));
        const filtered = mapped.filter((parsed): parsed is ExtractOkType<typeof parsed> => parsed.wasResultSuccessful) as Infer<ElementType>[];
        
        if (filtered.length == 0)
        {
            return error("empty array")
        }

        return ok(filtered);
    }
});

const object = <T extends Record<string, TCmsValue<unknown, unknown>>>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
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

        return ok(result as InferTCmsObject<T>);
    },
});

const union = <T extends Readonly<[...TCmsValue<unknown, unknown>[]]>>(...types: T): TCmsUnion<T> => ({
    type: "union",
    async parse(path: Path)
    {
        for (const [option, type] of types.entries())
        {
            try
            {
                const typeSafeIndex = option as ArrayIndices<T>;

                // @ts-expect-error TS does not recognize string indices as real indices
                const parseResult = (await type.parse(path)) as Infer<T[ArrayIndices<T>]>
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
    object,
    union
};

const videoWithThumb = object({video: url(), thumbnail: image()})
const video = url();
const schema = union(image(), video, union(image(), url(), videoWithThumb));

export function safePath(path: string)
{
    return path as Path;
}

export function relativePath(relativePath: Path)
{
    return safePath(path.join(process.cwd(), relativePath));
}

const imageFolder = "public" as const;