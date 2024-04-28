import { promises as fileSystem } from "node:fs";
import path from "node:path";
import { promisify } from "util";
import { type ZodObject, type ZodRawShape, z } from "zod";
import html from "remark-html";
import strip from "strip-markdown";
import { error, type ExtractErrorTypeRaw, type ExtractOkType, map, ok, type Result } from "~/types/result";
import { type Brand } from "../typeSafety";
import {  getPath, readFileSafe, safeReadDir, sizeOfAsync } from "./fileManagement";
import matter from "gray-matter";
import { remark } from "remark";

export type TCmsValue<Value, Error> = {
    readonly parse: Parser<Value, Error>;
}

type TCmsEntity = {
    name: string
}

type Parser<OkType, ErrorType> = ((path: Path) => Promise<Result<OkType, ErrorType>>);

type ImageError = string;
type TCmsImage = {
    readonly type: "image";
} & TCmsValue<Image, ImageError>

type TCmsMarkdownWithContent<T extends ZodRawShape> = TCmsValue<{
    html: string;
    asString: string;
    matters: z.infer<ZodObject<T>>;
}, "could not read file" | "invalid matter"> & {type: "markdownWithContent"};


type MarkdownError = "no matches" | "invalid name";
type TCmsMarkdown = {
    markdownWithContent: typeof markdownWithContent,
    readonly type: "markdown";
} & TCmsValue<Markdown, MarkdownError>


const couldNotReadDirectory = "could not read directory";

interface TCmsObject<T extends TCmsRecord>
    extends TCmsValue<InferTCmsObject<T>, "no matches" | typeof couldNotReadDirectory>
{
    readonly type: "object";
    readonly withName: ReturnType<typeof objectWithName>;
}
type UrlError = "no matches" | "invalid url" | "invalid extension";

type TCmsUrl = {
    readonly type: "url";
    readonly parse: Parser<Url, UrlError>;
} & TCmsValue<Url, UrlError>

interface TCmsArray<ElementType extends TCmsValue<unknown, unknown>>
    extends TCmsValue<(Infer<ElementType>)[], "empty array" | typeof couldNotReadDirectory>
{
    readonly type: "array";
}

interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>>
    extends TCmsValue<InferTCmsUnion<T>, "no matches">
{
    readonly type: "union";
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


type InferTCmsObject<T extends TCmsRecord> = {
    [Key in keyof T]: Infer<T[Key]>;
};

type ArrayIndices<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = Exclude<keyof T, keyof Array<unknown>>;

type InferTCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = {
    [Key in ArrayIndices<T>]: {
        option: Key, // @ts-expect-error TS does not recognize string indices as real indices
        value: Infer<T[Key]>}
}[ArrayIndices<T>]

export type Infer<T extends TCmsValue<unknown, unknown>> =  T extends TCmsValue<infer OkType, unknown> ? OkType : never;
export type InferError<T extends TCmsValue<unknown, unknown>> = T extends TCmsValue<unknown, infer ErrorType> ? ErrorType : never;

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
        
        const url = path.split(imageFolder)[1]?.replaceAll(`\\`, "/");

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
        const filtered = mapped.filter((parsed): parsed is PromiseFulfilledResult<ExtractOkType<Result<unknown, unknown>>> => parsed.status === "fulfilled" && parsed.value.wasResultSuccessful);
        const remapped = filtered.map(parsed => parsed.value.okValue) as Infer<ElementType>[];
        
        if (remapped.length == 0)
        {
            return error("empty array")
        }

        return ok(remapped);
    }
});

type TCmsRecord = Record<string, TCmsValue<unknown, unknown>>;

type InferTCmsObjectWithName<T extends TCmsRecord> = {
    name: string;
    parsedObject: InferTCmsObject<T>;
};

interface TCmsObjectWithName<T extends TCmsRecord>
extends TCmsValue<InferTCmsObjectWithName<T>, "no matches" | "name does not match" | typeof couldNotReadDirectory>
{
    readonly type: "objectWithName";
}

const objectWithName = <T extends TCmsRecord> (parse: Parser<InferTCmsObject<T>, "no matches" | typeof couldNotReadDirectory>) => (namePattern?: string): TCmsObjectWithName<T> =>
({
    type: "objectWithName",
    async parse(inPath: Path)
    {
        const name = path.basename(inPath, path.extname(inPath));
        if (namePattern && !name.match(namePattern))
        {
            return error("name does not match");
        }
    
        const parseResult = await parse(inPath);
        return map(parseResult, okParse => ({name, parsedObject: okParse}));
    }
});

const objectParse = <T extends TCmsRecord> (fields: T): Parser<InferTCmsObject<T>, typeof couldNotReadDirectory | "no matches"> => async (path: Path) =>
{
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

        return error("no matches" as const);
    }));

    const filtered = result.filter((value): value is PromiseFulfilledResult<ExtractOkType<Result<unknown, unknown>>> => value.status === "fulfilled" && value.value.wasResultSuccessful);
    if (filtered.length !== result.length)
    {
        return error("no matches" as const);
    }

    return ok((filtered.map(value => value.value.okValue)) as InferTCmsObject<T>);
};
const object = <T extends TCmsRecord>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
    parse: objectParse<T>(fields),
    withName: objectWithName<T>(objectParse<T>(fields))
});

const union = <T extends Readonly<[...TCmsValue<unknown, unknown>[]]>>(...types: T): TCmsUnion<T> => ({
    type: "union",
    async parse(path: Path)
    {
        for (const [option, type] of types.entries())
        {
            const typeSafeIndex = option as ArrayIndices<T>;

            const parseResult = (await type.parse(path))
            
            if (!parseResult.wasResultSuccessful)
            {
                continue;
            }
                
            return ok({
                option: typeSafeIndex,
                // @ts-expect-error TS does not recognize string indices as real ind
                value: (parseResult.okValue) as Infer<T[ArrayIndices<T>]>
            }) 
        }
        
        return error("no matches" as const);
    }
});

const parseMarkdownWithContent = <T extends ZodRawShape> (matters: ZodObject<T>) => ((async (path: Path) => {
    const contentFile = await readFileSafe(path);

    if (!contentFile.wasResultSuccessful)
    {
        return error("could not read file" as const);
    }

    const matterResult: matter.GrayMatterFile<Buffer> = matter(contentFile.okValue);
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    
    const processedAsString = await remark()
        .use(strip)
        .process(matterResult.content);
    
    const matterData = matterResult.data;
    if (matters.safeParse(matterData))
    {
        const literalNewLine = "\\n";
        const newLineChar = "\r\n";

        return ok({
                matters: matterData as z.infer<typeof matters>,
                html: processedContent.toString(),
                asString: processedAsString.toString()
            });
    }
    else
    {
        return error("invalid matter" as const);
    }
}));

const markdownWithContent = <T extends ZodRawShape> (matters: ZodObject<T>): TCmsMarkdownWithContent<T> => ({
    type: "markdownWithContent",
    parse: parseMarkdownWithContent(matters)
})

const markdown = <T extends string>(namePattern?: T): TCmsMarkdown => (
{
    type: "markdown",
    markdownWithContent,
    parse: promisify((path: Path) => {
        const extension = ".md";
        if (!path.endsWith(extension))
        {
            return error("invalid extension" as const);
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


export const tcms = {
    url,
    markdown,
    image,
    array,
    object,
    union
};

const test = object({test: url()}).withName();
type a = Infer<typeof test>;

const imageFolder = "public" as const;
