import {orderFilePath} from "~/config";
import {getFileRelative} from "~/cms/fileManagement";
import log from "../logging";
import { type PieceType } from "./cmsSchemas";

export async function orderByConfig(pieces: PieceType[])
{
    const orderFile = await getFileRelative(orderFilePath)
    const asString = orderFile.toString()
    const lines = asString.split("\r\n");

    pieces.sort((a, b) => {
        const nameA = a.option === "0" ? a.value.name : a.value.value.name;
        const nameB = b.option === "0" ? b.value.name : b.value.value.name;
        const aIndex = lines.indexOf(nameA);
        const bIndex = lines.indexOf(nameB);

        const correctedAIndex = aIndex === -1 ? 9999 : aIndex;
        if (aIndex === -1)
        {
            log.error(`No ordering found for ${nameA}`);
        }

        if (bIndex === -1)
        {
            log.error(`No ordering found for ${nameB}`);
        }

        return correctedAIndex - bIndex
    })
}
