import matter from "gray-matter";
import type { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { type GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";
import { type Dirent, promises as fileSystem } from "node:fs";
import { type ParsedUrlQuery } from "node:querystring";
import { remark } from "remark";
import html from "remark-html";
import { Scaffold } from "~/components/scaffold";
import "@total-typescript/ts-reset";
import { VerticalCenterBox } from "~/components/verticalCenterBox";
const ReactPlayerComponent = dynamic(() => import("react-player/youtube"), { ssr: false });
import {
    absoluteToRelativePath,
    getFirstMarkdownFile,
    filterImagesAndUrls,
    getWorksDirectoryEntities, removeMarkdownExtension, getPath, getWorkDirectory
} from "~/cms/fileManagement";
import { includesInner, type StringWithInnerSubstring } from "~/typeSafety";
import {promiseFullfilledPredicate, promiseRejectedPredicate, valueMapper} from "~/promises/promisePredicates";
import type {YouTubeConfig} from "react-player/youtube";
import dynamic from "next/dynamic";

type ImageWorkType = {
    type: "image",
    path: string
}

type VideoWorkType = {
    type: "video",
    url: string
}

type ImageOrVideoUrlWork = ImageWorkType | VideoWorkType;

interface WorkProps
{
    collectionTitle: string,
    contentHtml: string,
    works: ImageOrVideoUrlWork[]
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

        const imagePaths = await filterImagesAndUrls(directoryEntries);

        const fulfilledFilePaths = imagePaths.filter(promiseFullfilledPredicate).map(valueMapper);
        const rejectedFilePaths = imagePaths.filter(promiseRejectedPredicate);

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
                    collectionTitle: removeMarkdownExtension(content.name),
                    contentHtml: contentHtml,
                    works: fulfilledFilePaths
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
                {props.collectionTitle}
            </h2>
                <div className="font-inter text-[17px] text-neutral-700 text-center" dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
            </div>
        </VerticalCenterBox>
        <VerticalCenterBox className="pt-[74px] pb-[156px] space-y-[128px]">
            {props.works.map((work) =>
                {
                    if (work.type === "image")
                    {
                        return (
                          <div key={work.path}>
                              <Image src={work.path} width={512} height={512} alt={work.path}/>
                          </div>
                        );
                    }
                    else
                    {

                        const config: YouTubeConfig = {
                            playerVars: {
                                controls: 0,
                                disablekb: 1,
                                modestbranding: 1,
                                showinfo: 0
                            }
                        };
                        return (
                            <ReactPlayerComponent
                                width={364}
                                height={205}
                                url={piece.url}
                                controls={false}
                                muted={true}
                                loop={true}
                                playing={props.shouldPlay}
                                config={config}/>
                        )
                    }
                }}
        </VerticalCenterBox>
        <Link href="/" className="w-responsive-screen pl-[411px] pb-[74px]">
            <BackIcon/>
        </Link>
    </Scaffold>
}

export default WorkShowcase;