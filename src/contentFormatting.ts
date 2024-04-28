import matter from "gray-matter";
import { type Dirent, promises as fileSystem } from "node:fs";
import { remark } from "remark";
import html from "remark-html";
import strip from "strip-markdown";
import { getPath, readFileSafe as readFileSafe, safePath } from "./cms/fileManagement";
import type { Locale } from "./localization/localization";
import { type ZodObject, type ZodRawShape, z } from "zod";
import { tcms, type Path, type TCmsValue } from "./cms/tcmsTypes";

const toContentObject: (locale: Locale, content: Dirent) => Promise<[Locale, {
    html: string;
    asString: string;
    title: string
}]> = async (locale: Locale, content: Dirent) =>
{
    const contentFile: Buffer = await fileSystem.readFile(getPath(content));
    const matterResult: matter.GrayMatterFile<Buffer> = matter(contentFile);
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    
    const processedAsString = await remark()
        .use(strip)
        .process(matterResult.content);
    
    const title = matterResult.data.title as unknown;
    if (typeof title === "string")
    {
        const literalNewLine = "\\n";
        const newLineChar = "\r\n";
        const contentObject = {
            title: title.replaceAll(literalNewLine, newLineChar),
            html: processedContent.toString(),
            asString: processedAsString.toString()
        };
        return [locale, contentObject];
    }
    else
    {
        throw new Error("Title is malformed")
    }
};

export default toContentObject;

const testParse = tcms.markdown().markdownWithContent(z.object({title: z.string()})).parse(safePath("test.md"));