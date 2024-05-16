export function getContainedByAspectRatioStyle(
  width: number | string,
  height: number | string,
  divWidth: number,
  divHeight: number,
) {
  // noinspection JSSuspiciousNameCombination
  return {
    width: `min(${width}, calc(${height} * ${divWidth / divHeight}))`,
    height: `min(${height}, calc(${width} * ${divHeight / divWidth}))`,
  };
}
