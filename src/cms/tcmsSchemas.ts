import { error, type ExtractOkType, map, ok, type Result } from "~/types/result";
import { type Path, type TCmsValue, type TCmsUrl, type Parser, type InferOk, type TCmsArray, type InferError, couldNotReadDirectory, type TCmsImage, imageFolder, type TCmsRecord, type InferTCmsObject, type TCmsObject, type TCmsUnion, type ArrayIndices, type TCmsMarkdown, type MarkdownWithContent, type ArrayWithName, type ObjectWithName } from "./tcmsTypes";
import { readFile } from "node:fs/promises";
import { z, type ZodObject, type ZodRawShape } from "zod";
import path from "node:path";
import { getPath, readFileSafe, safeReadDir, sizeOfAsync } from "./fileManagement";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import strip from "strip-markdown";
import { promisify } from "node:util";

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

const arrayWithName = <T extends TCmsValue<unknown, unknown>> (parse: Parser<InferOk<TCmsArray<T>>, InferError<TCmsArray<T>>>): ArrayWithName<T> => (namePattern?: string) =>
({
    type: "arrayWithName",
    async parse(inPath: Path)
    {
        const name = path.basename(inPath);
        if (namePattern && !name.match(namePattern))
        {
            return error("name does not match" as const);
        }
    
        const parseResult = await parse(inPath);
        return map(parseResult, okParse => ({name, parsed: okParse}));
    }
});

const arrayParse = <ElementType extends TCmsValue> (element: ElementType): Parser<InferOk<ElementType>[], InferError<TCmsArray<ElementType>>> => async (path: Path) =>
{
    const dirents = await safeReadDir(path);

    if (!dirents.wasResultSuccessful)
    {
        return error(couldNotReadDirectory);
    }

    const mapped = await Promise.allSettled(dirents.okValue.map(async (dirent) => (element.parse(getPath(dirent)))));
    const filtered = mapped.filter((parsed): parsed is PromiseFulfilledResult<ExtractOkType<Result<unknown, unknown>>> => parsed.status === "fulfilled" && parsed.value.wasResultSuccessful);
    const remapped = filtered.map(parsed => parsed.value.okValue) as InferOk<ElementType>[];

    if (remapped.length == 0)
    {
        return error("empty array" as const);
    }

    return ok(remapped);
};

const array = <ElementType extends TCmsValue<unknown, unknown>>(element: ElementType): TCmsArray<ElementType> => ({
    type: "array",
    parse: arrayParse(element),
    withName: arrayWithName(arrayParse(element))
});

export async function getUrl(imageOrUrlPath: Path)
{
    return (await readFile(imageOrUrlPath)).toString();
}

export async function getUrlFromPath(path: Path)
{
    return (await readFile(path)).toString();
}

const objectWithName = <T extends TCmsRecord> (parse: Parser<InferTCmsObject<T>, "no matches" | typeof couldNotReadDirectory>): ObjectWithName<T> => (namePattern?: string) =>
({
    type: "objectWithName",
    async parse(inPath: Path)
    {
        const name = path.basename(inPath);
        if (namePattern && !name.match(namePattern))
        {
            return error("name does not match" as const);
        }
    
        const parseResult = await parse(inPath);
        return map(parseResult, okParse => ({name, parsed: okParse}));
    }
});

const objectParse = <T extends TCmsRecord, KeyType extends string | number | symbol = keyof T> (fields: T): Parser<InferTCmsObject<T>, typeof couldNotReadDirectory | "no matches"> => async (path: Path) =>
{
    const dirents = await safeReadDir(path);
    if (!dirents.wasResultSuccessful)
    {
        return error(couldNotReadDirectory);
    }

    const result = await Promise.allSettled(Object.entries(fields).map(async ([key, value]) =>
    {
        for (const dirent of dirents.okValue)
        {
            const parsed = await value.parse(getPath(dirent));
            if (parsed.wasResultSuccessful)
            {
                return ok({[key as KeyType]: parsed.okValue} as Record<KeyType, unknown>);
            }
        }

        return error("no matches" as const);
    }));

    type ResultType = Result<Record<KeyType, unknown>, "no matches">;

    const filtered = result.filter(((value: PromiseSettledResult<ResultType>): value is PromiseFulfilledResult<ResultType> => (value.status === "fulfilled")));
    const okValues = (filtered.map(value => value.value)).filter(value => value.wasResultSuccessful);
    // Eslint is not as smart as TS in this case, so:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const mapped = okValues.map(value => value.okValue);

    if (okValues.length !== result.length)
    {
        return error("no matches" as const);
    }

    const spread = mapped.reduce((previous, current) => Object.assign(previous, current) as Record<KeyType, unknown>, {}) as InferTCmsObject<T>;
    return ok(spread);
};
const object = <T extends TCmsRecord>(
    fields: T
): TCmsObject<T> => ({
    type: "object",
    parse: objectParse(fields),
    withName: objectWithName(objectParse(fields))
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
                value: (parseResult.okValue) as InferOk<T[ArrayIndicesString<T>]>
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

const markdownWithContent: MarkdownWithContent = <T extends ZodRawShape> (matters: ZodObject<T>) => ({
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
