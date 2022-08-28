import { getParamNames } from './get-param-names';

export const getFilteredCount = (data: any[], q: Record<string, any>) => {
  const names = getParamNames(q);
  if (names.length === 0) {
    return data.length;
  }
  return data.reduce((prev: number, curr, i) => {
    for (const name of names) {
      if (!data[i].hasOwnProperty(name)) {
        return prev;
      }
      if (data[i][name] !== q[name]) {
        return prev;
      }
    }
    return prev + 1;
  }, 0);
};
