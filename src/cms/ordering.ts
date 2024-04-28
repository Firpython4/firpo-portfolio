import {orderFilePath} from "~/config";
import {getFileRelative} from "~/cms/fileManagement";
import log from "../logging";
import { type PieceType } from "./schemaTypes";

export async function orderByConfig(pieces: PieceType[])
{
    const orderFile = await getFileRelative(orderFilePath)
    const asString = orderFile.toString()
    const lines = asString.split("\r\n");

    pieces.sort((leftElement, rightElement) => {
        let nameA;
        let nameB;
        if (leftElement.option === 0)
        {
            nameA = leftElement.value.name;
        }
        else
        {
            nameA = leftElement.value.value.name;
        }
        if (rightElement.option === 0)
        {
            nameB = rightElement.value.name;
        }
        else
        {
            nameB = rightElement.value.value.name;
        }

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
