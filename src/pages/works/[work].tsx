import type { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { type GetStaticPaths } from "next";
import Image from "next/image";
import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { remark } from "remark";
import { Scaffold } from "../../components/scaffold";
import "@total-typescript/ts-reset";
import { VerticalCenterBox } from "../../components/verticalCenterBox";
import Link from "next/link";
import { type ParsedUrlQuery } from "node:querystring";
import html from "remark-html";
import matter from "gray-matter";

interface WorkProps
{
    title: string,
    contentHtml: string,
    imagePaths: string[]
}

export const getStaticPaths = (async () =>
{
    const imageDirectory: string = path.join(process.cwd(), '/public/pieces');
    const directories: string[] = (await fileSystem.readdir(imageDirectory, {withFileTypes: true}))
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
        const pageDirectory: string = path.join(process.cwd(), '/public/pieces', context.params.work);
        const directoryEntries: Dirent[] = await fileSystem.readdir(pageDirectory, {withFileTypes: true});

        const imagePaths: string[] = directoryEntries
            .filter((dirent: Dirent) => dirent.isFile())
            .filter((dirent: Dirent) =>
                {
                    const extension: string = path.extname(getPath(dirent)).toLowerCase();
                    return extension === ".png" || extension === ".jpg";
                })
            .map((dirent: Dirent) => getPath(dirent));
        
        const content: Dirent | undefined = directoryEntries
            .filter((dirent: Dirent) => dirent.isFile())
            .filter((dirent: Dirent) => path.extname(getPath(dirent)).toLowerCase() === ".md")[0]
        
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
                    title: content.name.replace(".md", ""),
                    contentHtml: contentHtml,
                    imagePaths: imagePaths.map((imagePath: string) => (imagePath.split(path.join("public")))[1]).filter((element: string | undefined) => element !== undefined) as string[]
                }
            }
        }


        throw new Error("Unable to locate markdown file for content")
    }
    
    throw new Error("Invalid URL")
}) satisfies GetStaticProps<WorkProps>

function getPath(dirent: Dirent)
{
    return path.join(dirent.path, dirent.name);
}

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