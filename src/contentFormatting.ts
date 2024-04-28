import matter from "gray-matter";
import { type Dirent, promises as fileSystem } from "node:fs";
import { remark } from "remark";
import html from "remark-html";
import { getPath } from "./cms/fileManagement";
import type { Locale } from "./localization/localization";

const toContentObject: (locale: Locale, content: Dirent) => Promise<["pt-BR" | "en-US", {
    html: string;
    title: string
}]> = async (locale: Locale, content: Dirent) =>
{
    const contentFile: Buffer = await fileSystem.readFile(getPath(content));
    const matterResult: matter.GrayMatterFile<Buffer> = matter(contentFile);
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    
    const title = matterResult.data.title as unknown;
    if (typeof title === "string")
    {
        const literalNewLine = "\\n";
        const newLineChar = "\r\n";
        const contentObject = {
            title: title.replaceAll(literalNewLine, newLineChar),
            html: processedContent.toString()
        };
        return [locale, contentObject];
    }
    else
    {
        throw new Error("Title is malformed")
    }
};

export default toContentObject;