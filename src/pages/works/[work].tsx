import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { type GetStaticPaths } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { type Dirent, promises as fileSystem } from "node:fs";
import path from "node:path";
import { Scaffold } from "../../components/scaffold";
import "@total-typescript/ts-reset";

interface WorkProps
{
    title: string,
    description: string,
    images: string[]
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
        const dirents = await fileSystem.readdir(pageDirectory, {withFileTypes: true});

        const imagePaths = dirents
            .filter(dirent => dirent.isFile())
            .filter(dirent =>
                {
                    const extension: string = path.extname(getPath(dirent)).toLowerCase();
                    return extension === ".png" || extension === ".jpg";
                })
            .map(dirent => getPath(dirent));
        
        const content = dirents
            .filter(dirent => dirent.isFile())
            .filter(dirent => path.extname(getPath(dirent)).toLowerCase() === ".md")[0]
        
        if (content)
        {
            return {props: {
                title: content.name.replace(".md", ""),
                description: (await fileSystem.readFile(getPath(content))).toString(),
                images: imagePaths.map(imagePath => imagePath.split("/public")[0]).filter(element => element)
            }}
        }

        throw new Error("Unable to locate markdown file for content")
    }
    
    throw new Error("Invalid URL")
}) satisfies GetStaticProps<WorkProps>

const WorkShowcase = (props: InferGetStaticPropsType<typeof getStaticProps>) =>
{
    const router = useRouter();
    if (typeof(router.query.work) === "string")
    {
        return <Scaffold>
            <h2>
                {props.title}
            </h2>
            <div>
                {props.images.map((imagePath) => (
                    <div key={imagePath}>
                        <Image src={imagePath} width={128} height={128} alt={imagePath}/>
                    </div>
                ))}
            </div>
            <p>
                {props.description}
            </p>
        </Scaffold>
    }
    
    return <p>Error</p>
}

export default WorkShowcase;