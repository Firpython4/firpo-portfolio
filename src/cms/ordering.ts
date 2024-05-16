import log from "../logging";
import { type PieceType } from "./schemaTypes";
import { getFileRelative } from "./type-fs/src/fileManagement";
import { type Path } from "./type-fs/src/types";

export async function orderByConfig(pieces: PieceType[], orderFilePath: Path) {
  const orderFile = await getFileRelative(orderFilePath);
  const asString = orderFile.toString();
  const lines = asString.split("\r\n");

  pieces.sort((leftElement, rightElement) => {
    let nameA: string;
    let nameB: string;
    if (leftElement.option === 2) {
      nameA = leftElement.value.name;
    } else if (leftElement.option === 0) {
      nameA = leftElement.value.name;
    } else {
      nameA = leftElement.value.url.name;
    }
    if (rightElement.option === 2) {
      nameB = rightElement.value.name;
    } else if (rightElement.option === 0) {
      nameB = rightElement.value.name;
    } else {
      nameB = rightElement.value.url.name;
    }

    const aIndex = lines.indexOf(nameA);
    const bIndex = lines.indexOf(nameB);
    const correctedAIndex = aIndex === -1 ? 9999 : aIndex;
    if (aIndex === -1) {
      log.error(`No ordering found for ${nameA}`);
    }

    if (bIndex === -1) {
      log.error(`No ordering found for ${nameB}`);
    }

    return correctedAIndex - bIndex;
  });
}
