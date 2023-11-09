export const simpleDeepCompare = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const getFirstDifferenceKey = (
  currentMap: Record<string, number>,
  cachedMap: Record<string, number>,
): string => {
  for (let key in currentMap) {
    if (currentMap[key] !== cachedMap[key]) {
      return key;
    }
  }
  return "-1";
}