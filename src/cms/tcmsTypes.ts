import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { z } from "zod";
import { error, type ExtractErrorType, type ExtractOkType, ok, type Result } from "~/types/result";
import { type Brand } from "../typeSafety";
import {  getPath, safeReadDir, sizeOfAsync } from "./fileManagement";
import { lstat } from "node:fs/promises";

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

type ImageError = string;
type TCmsImage = {
    readonly type: "image";
    readonly parse: Parser<Image, ImageError>;
}

type MarkdownError = "no matches" | "invalid name";
type TCmsMarkdown = {
    readonly type: "markdown";
    readonly parse: Parser<Markdown, MarkdownError>;
}

const couldNotReadDirectory = "could not read directory";

interface TCmsObject<T extends Record<string, TCmsValue<unknown, unknown>>> {
    readonly type: "object";
    readonly parse: Parser<InferTCmsObject<T>, "no matches" | typeof couldNotReadDirectory>
}

type UrlError = "no matches" | "invalid url" | "invalid extension";

type TCmsUrl = {
    readonly type: "url";
    readonly parse: Parser<Url, UrlError>;
}

interface TCmsArray<ElementType extends TCmsValue<unknown, unknown>> {
    readonly type: "array";
    //@ts-expect-error type inference is expected to get deep
    readonly parse: Parser<Infer<ElementType>[], "empty array" | typeof couldNotReadDirectory>;
}

interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> {
    readonly type: "union";
    readonly parse: Parser<InferTCmsUnion<T>, "no matches">;
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
    parse: async pathToParse => {
        const extension = ".url";
        if (!pathToParse.endsWith(extension))
        {
            return error("invalid extension");
        }
        
        const url = await getUrlFromPath(pathToParse);
        
        if (!z.string().url().safeParse(url))
        {
            return error("invalid url");
        }
        
        return ok({
            type: "url",
            name: getName(pathToParse),
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

        if (!size.wasResultSuccessful)
        {
            return error(`Unable to read file ${path}`)
        }
        
        const sizeValue = size.okValue;
        
        if (!sizeValue)
        {
            return error(`Unable to read file ${path}`)
        }

        if (sizeValue.width === undefined)
        {
            return error(`Invalid image width for ${path}`)
        }
        if (sizeValue.height === undefined)
        {
            return error(`Invalid image height for ${path}`)
        }

        return ok({
            type: "image",
            name: getName(path),
            width: sizeValue.width,
            height: sizeValue.height,
            url: url as `${string}${typeof imageFolder}/${string}`
        });
    }
});

function getName(inPath: Path)
{
    return path.basename(inPath, path.extname(inPath))
}

const array = <ElementType extends TCmsValue<unknown, unknown>>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    async parse(path: Path)
    {
        const dirents = await safeReadDir(path);

        if (!dirents.wasResultSuccessful)
        {
            return error(couldNotReadDirectory)
        }

        const mapped = await Promise.allSettled(dirents.okValue.map(async dirent => (element.parse(getPath(dirent)))));
        const filtered = mapped.filter((parsed): parsed is ExtractOkType<typeof parsed> => parsed.status === "fulfilled" && parsed.value.wasResultSuccessful) as Infer<ElementType>[];
        
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
        const dirents = await safeReadDir(path);
        if (!dirents.wasResultSuccessful)
        {
            return error(couldNotReadDirectory);
        }


        const result = await Promise.allSettled(Object.entries(fields).map(async ([, value]) =>
                                                       {
                                                            for (const dirent of dirents.okValue)
                                                            {
                                                                const parsed = await value.parse(getPath(dirent));
                                                                if (parsed.wasResultSuccessful)
                                                                {
                                                                    return parsed;
                                                                }
                                                            }

                                                            return error("no matches");
                                                       }));

        if (result.find(value => value.status === "fulfilled" && !value.value.wasResultSuccessful))
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
            const typeSafeIndex = option as ArrayIndices<T>;

            // @ts-expect-error TS does not recognize string indices as real indices
            const parseResult = (await type.parse(path)) as Infer<T[ArrayIndices<T>]>

            if (!parseResult.wasResultSuccessful)
            {
                continue;
            }

            return ok({
                option: typeSafeIndex,
                value: parseResult
            }) 
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

const imageFolder = "public" as const;
