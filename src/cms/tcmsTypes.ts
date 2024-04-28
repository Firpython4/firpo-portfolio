import { type ZodObject, type ZodRawShape, type z } from "zod";
import { type Result } from "~/types/result";
import { type Brand } from "../typeSafety";

export type TCmsValue<Value = unknown, Error = unknown> = {
    readonly parse: Parser<Value, Error>;
}

type TCmsEntity = {
    name: string
}

export type Parser<OkType, ErrorType> = ((path: Path) => Promise<Result<OkType, ErrorType>>);

type ImageError = string;
export type TCmsImage = {
    readonly type: "image";
} & TCmsValue<Image, ImageError>

export type TCmsMarkdownWithContent<T extends ZodRawShape> = TCmsValue<{
    html: string;
    asString: string;
    matters: z.infer<ZodObject<T>>;
}, "could not read file" | "invalid matter"> & {type: "markdownWithContent"};


export type MarkdownWithContent = <T extends ZodRawShape>(matters: ZodObject<T>) => TCmsMarkdownWithContent<T>;
type MarkdownError = "no matches" | "invalid name";
export type TCmsMarkdown = {
    markdownWithContent: MarkdownWithContent,
    readonly type: "markdown";
} & TCmsValue<Markdown, MarkdownError>

export const couldNotReadDirectory = "could not read directory";

export type ObjectWithName<T extends TCmsRecord> = (namePattern?: string) => TCmsObjectWithName<T>;
export interface TCmsObject<T extends TCmsRecord>
    extends TCmsValue<InferTCmsObject<T>, "no matches" | typeof couldNotReadDirectory>
{
    readonly type: "object";
    readonly withName: ObjectWithName<T>;
}
type UrlError = "no matches" | "invalid url" | "invalid extension";

export type TCmsUrl = {
    readonly type: "url";
    readonly parse: Parser<Url, UrlError>;
} & TCmsValue<Url, UrlError>

export type ArrayWithName<ElementType extends TCmsValue> = (namePattern?: string) => TCmsArrayWithName<ElementType>;
export interface TCmsArray<ElementType extends TCmsValue<unknown, unknown>>
    extends TCmsValue<(InferOk<ElementType>)[], "empty array" | typeof couldNotReadDirectory>
{
    readonly type: "array";
    readonly withName: ArrayWithName<ElementType>;
}

export interface TCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>>
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


export type InferTCmsObject<T extends TCmsRecord> = {
    [Key in keyof T]: InferOk<T[Key]>;
};

type ParseInt<T> = T extends `${infer N extends number}` ? N : never

 // @ts-expect-error TS does not recognize number indices as real indices
export type ArrayIndices<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = {[Key in Exclude<keyof T, keyof Array<unknown>>]: ParseInt<Key>}[ParseInt<Exclude<keyof T, keyof Array<unknown>>>]

type InferTCmsUnion<T extends Readonly<[...TCmsValue<unknown, unknown>[]]>> = {
    [Key in ArrayIndices<T>]: {
        option: Key,
        value: InferOk<T[Key]>}
}[ArrayIndices<T>]

export type InferOk<T extends TCmsValue<unknown, unknown>> =  T extends TCmsValue<infer OkType, unknown> ? OkType : never;
export type InferError<T extends TCmsValue<unknown, unknown>> = T extends TCmsValue<unknown, infer ErrorType> ? ErrorType : never;

export type TCmsRecord = Record<string, TCmsValue<unknown, unknown>>;

type InferTCmsObjectWithName<T extends TCmsRecord> = {
    name: string,
    parsed: InferTCmsObject<T>
};

type InferTCmsArrayWithName<T extends TCmsValue> = {
    name: string,
    parsed: InferOk<TCmsArray<T>>
};

export interface TCmsArrayWithName<T extends TCmsValue<unknown, unknown>> extends TCmsValue<InferTCmsArrayWithName<T>, "name does not match" | InferError<TCmsArray<T>>>
{
    readonly type: "arrayWithName";
}

export interface TCmsObjectWithName<T extends TCmsRecord>
extends TCmsValue<InferTCmsObjectWithName<T>, "no matches" | "name does not match" | typeof couldNotReadDirectory>
{
    readonly type: "objectWithName";
}

export const imageFolder = "public" as const;