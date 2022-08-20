import { getNames } from './get-names';

export const filter = (data: any[], q: Record<string, any>) => {
  const names = getNames(q, data[0]);
  if (!names.length) {
    return data;
  }
  return (data = data.filter((item) => {
    for (const name of names) {
      if (item[name] !== q[name]) {
        return false;
      }
    }
    return true;
  }));
};
