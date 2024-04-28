export function getUrl()
{
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (typeof url !== "string")
    {
        throw new Error("Invalid url environment variable")
    }
    
    return url;
}

export default getUrl;
