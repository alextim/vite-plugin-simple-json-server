import { getNames } from './get-names';

export const filter = (data: any[], q: Record<string, any>) => {
  if (data.length === 0) {
    return data;
  }
  const names = getNames(q, data[0]);
  if (!names.length) {
    return data;
  }
  return data.filter((item) => {
    for (const name of names) {
      if (item[name] !== q[name]) {
        return false;
      }
    }
    return true;
  });
};
