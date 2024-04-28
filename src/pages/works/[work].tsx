import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { type GetStaticPaths } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { Scaffold } from "../../components/scaffold";
import "@total-typescript/ts-reset";
import { VerticalCenterBox } from "../../components/verticalCenterBox";
import Link from "next/link";

interface WorkProps
{
    title: string,
    description: string,
    imagePaths: string[]
}

export const getStaticPaths = (async () =>
{
    const imageDirectory = path.join(process.cwd(), '/public/pieces');
    const directories = (await fileSystem.readdir(imageDirectory, {withFileTypes: true}))
        .filter(dirent => dirent.isDirectory())
        .map(directory => directory.name);
    
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

function getPath(dirent: Dirent): string
{
    return path.join(dirent.path, dirent.name);
}

export const getStaticProps = (async (context) =>
{
    if (context.params && typeof(context.params.work) === "string")
    {
        const pageDirectory = path.join(process.cwd(), '/public/pieces', context.params.work);
        const directoryEntries = await fileSystem.readdir(pageDirectory, {withFileTypes: true});

        const imagePaths = directoryEntries
            .filter(dirent => dirent.isFile())
            .filter(dirent =>
                {
                    const extension: string = path.extname(getPath(dirent)).toLowerCase();
                    return extension === ".png" || extension === ".jpg";
                })
            .map(dirent => getPath(dirent));
        
        const content = directoryEntries
            .filter(dirent => dirent.isFile())
            .filter(dirent => path.extname(getPath(dirent)).toLowerCase() === ".md")[0]
        
        if (content)
        {
            return {
                props: {
                    title: content.name.replace(".md", ""),
                    description: (await fileSystem.readFile(getPath(content))).toString(),
                    imagePaths: imagePaths.map(imagePath => (imagePath.split(path.join("public")))[1]).filter(element => element !== undefined) as string[]
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
    return <Scaffold>
        <Link href="/" className="w-responsive-screen pl-[411px] pt-[44px]">
            <BackIcon/>
        </Link>
        <VerticalCenterBox className="space-y-[16px] pt-[88px]">
            <h2 className="font-extrabold font-inter text-[17px] text-neutral-700 text-center">
                {props.title}
            </h2>
            <p className="font-inter text-[17px] text-neutral-700 text-center">
                {props.description}
            </p>
        </VerticalCenterBox>
        <VerticalCenterBox className="pt-[74px] pb-[156px] space-y-[128px]">
            {props.imagePaths.map((imagePath) =>
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