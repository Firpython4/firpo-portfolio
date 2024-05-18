import { EOL } from "node:os";
import log from "../logging";
import { type CollectionType, type PieceType } from "./schemaTypes";

export const collectionNameProvider = (collection: CollectionType) => collection.name;

export const pieceNameProvider = (element: PieceType) => {
  if (element.option === 2) {
    return element.value.name;
  } else if (element.option === 0) {
    return element.value.name;
  } else {
    return element.value.url.name;
  }
}

export function orderByConfig<ElementType>(
  arrayToSort: ElementType[],
  nameProvider: (element: ElementType) => string,
  orderFile: Buffer,
) {
  const asString = orderFile.toString();
  const lines = asString.split(EOL);

  arrayToSort.sort((leftElement, rightElement) => {
    const nameA = nameProvider(leftElement);
    const nameB = nameProvider(rightElement);

    const aIndex = lines.indexOf(nameA);
    const bIndex = lines.indexOf(nameB);
    const correctedAIndex = aIndex === -1 ? 9999 : aIndex;
    const correctedBIndex = bIndex === -1 ? 9999 : bIndex;
    if (aIndex === -1) {
      log.error(`No ordering found for ${nameA}`);
    }

    if (bIndex === -1) {
      log.error(`No ordering found for ${nameB}`);
    }

    return correctedAIndex - correctedBIndex;
  });
}
