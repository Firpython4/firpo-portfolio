import type {PieceType} from "~/types/pieceType";
import {orderFilePath} from "~/config";
import {getFileRelative} from "~/cms/fileManagement";
import { type TextType } from "~/localization/localization";
import log from "../logging";

export async function orderByConfig<GenericTextType extends TextType>(pieces: PieceType<GenericTextType>[])
{
    const orderFile = await getFileRelative(orderFilePath)
    const asString = orderFile.toString()
    const lines = asString.split("\r\n");

    pieces.sort((a, b) => {
        const aIndex = lines.indexOf(a.title);
        const bIndex = lines.indexOf(b.title);

        const correctedAIndex = aIndex === -1 ? 9999 : aIndex;
        if (aIndex === -1)
        {
            log.error(`No ordering found for ${a.title}`);
        }

        if (bIndex === -1)
        {
            log.error(`No ordering found for ${b.title}`);
        }

        return correctedAIndex - bIndex
    })
}
