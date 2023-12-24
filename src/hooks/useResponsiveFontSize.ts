import { useBreakpoint } from "./tailwind";

type SizeType = "sm" | "md" | "lg" | "xl";
type SizeIndexType = 0 | 1 | 2 | 3;

const sizeToIndex = (size: SizeType) =>
{
    const sizeToIndex: Record<SizeType, SizeIndexType> = {
        sm: 0,
        md: 1,
        lg: 2,
        xl: 3
    }
    
    return sizeToIndex[size];
}

const indexToSize = (index: SizeIndexType) =>
{
    const indexToSize = {
        0: "small-font",
        1: "medium-font",
        2: "large-font"
    };
    
    return indexToSize[index];
}

const useResponsiveFontSize = (size: SizeType) =>
{
    const isMedium = useBreakpoint("md");
    const isLarge = useBreakpoint("lg");
    
    let a = sizeToIndex(size);
    

    if (isMedium)
    {
        const result = a + sizeToIndex("md");
        return indexToSize(result);
    }

    if (isLarge)
    {
        return "text-lg";
    }

    return "text-sm";
}
