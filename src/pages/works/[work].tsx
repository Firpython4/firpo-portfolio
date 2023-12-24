import matter from "gray-matter";
import type { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { type GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";
import { type Dirent, promises as fileSystem } from "node:fs";
import { type ParsedUrlQuery } from "node:querystring";
import { remark } from "remark";
import html from "remark-html";
import { Scaffold } from "../../components/scaffold";
import "@total-typescript/ts-reset";
import { VerticalCenterBox } from "../../components/verticalCenterBox";
import { type PublicFolder, publicFolderValue } from "../../config";
import {
    absoluteToRelativePath,
    getFirstMarkdownFile,
    filterImages,
    getWorksDirectoryEntities, removeMarkdownExtension, getPath, getWorkDirectory
} from "../../path/fileManagement";
import { includesInner, type StringWithInnerSubstring } from "../../typeSafety";

interface WorkProps
{
    title: string,
    contentHtml: string,
    imagePaths: string[]
}

export const getStaticPaths = (async () =>
{
    const directories: string[] = (await getWorksDirectoryEntities())
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((directory: Dirent) => directory.name);
    
    return {
        paths: directories.map(directoryName =>
        {
            return {
                params: {
                    work: directoryName
                }
            };
        }),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context: GetStaticPropsContext<ParsedUrlQuery, string | false | object | undefined>) =>
{
    if (context.params && typeof(context.params.work) === "string")
    {
        const directoryEntries = await getWorkDirectory(context.params.work);

        const imagePaths: string[] = filterImages(directoryEntries);
        
        const filteredPaths: StringWithInnerSubstring<PublicFolder>[] = imagePaths.filter((imagePath: string) => includesInner(imagePath, publicFolderValue)) as StringWithInnerSubstring<"public">[];
        
        const content: Dirent | undefined = getFirstMarkdownFile(directoryEntries)
        
        if (content)
        {
            const contentFile: Buffer = await fileSystem.readFile(getPath(content));
            const matterResult: matter.GrayMatterFile<Buffer> = matter(contentFile);
            const processedContent = await remark()
            .use(html)
            .process(matterResult.content);

            const contentHtml = processedContent.toString();
            return {
                props: {
                    title: removeMarkdownExtension(content.name),
                    contentHtml: contentHtml,
                    imagePaths: filteredPaths.map(absoluteToRelativePath).filter((element: string | undefined) => element !== undefined) 
                }
            }
        }


        throw new Error("Unable to locate markdown file for content")
    }
    
    throw new Error("Invalid URL")
}) satisfies GetStaticProps<WorkProps>

const BackIcon = (props: {className?: string}) => <Image className={props.className} alt="home" src="/icons/back-icon.svg" width={31} height={31}/>;

const WorkShowcase = (props: InferGetStaticPropsType<typeof getStaticProps>) =>
{
    const dangerouslySetInnerHTML = {
        __html: props.contentHtml
    };

    return <Scaffold>
        <Link href="/" className="w-responsive-screen pl-[411px] pt-[44px]">
            <BackIcon/>
        </Link>
        <VerticalCenterBox className="space-y-[16px] pt-[88px]">
            <h2 className="font-extrabold font-inter text-[17px] text-neutral-700 text-center">
                {props.title}
            </h2>
                <div className="font-inter text-[17px] text-neutral-700 text-center" dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
            </div>
        </VerticalCenterBox>
        <VerticalCenterBox className="pt-[74px] pb-[156px] space-y-[128px]">
            {props.imagePaths.map((imagePath: string) =>
                (
                  <div key={imagePath}>
                      <Image src={imagePath} width={512} height={512} alt={imagePath}/>
                  </div>
                ))}
        </VerticalCenterBox>
        <Link href="/" className="w-responsive-screen pl-[411px] pb-[74px]">
            <BackIcon/>
        </Link>
    </Scaffold>
}

export default WorkShowcase;