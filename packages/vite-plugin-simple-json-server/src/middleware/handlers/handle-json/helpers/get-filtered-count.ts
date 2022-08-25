import { getNames } from './get-names';

export const getFilteredCount = (data: any[], q: Record<string, any>) => {
  const names = getNames(q, data[0]);
  if (!names.length) {
    return data.length;
  }
  return data.reduce((prev: number, curr, i) => {
    for (const name of names) {
      if (data[i][name] !== q[name]) {
        return prev;
      }
    }
    return (prev += 1);
  }, 0);
};
