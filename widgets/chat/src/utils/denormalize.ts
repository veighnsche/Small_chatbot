export const denormalize = <T extends { id: string; }>(array: T[]): Record<string, T> => {
  return array.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
};