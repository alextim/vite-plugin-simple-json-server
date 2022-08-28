import { getParamNames } from './get-param-names';

export const filter = (data: any[], q: Record<string, any>) => {
  const names = getParamNames(q);
  if (!names.length) {
    return data;
  }
  return data.filter((item) => {
    for (const name of names) {
      if (!item.hasOwnProperty(name)) {
        return false;
      }
      if (Array.isArray(q[name])) {
        if (!q[name].some((val: any) => val == item[name])) {
          return false;
        }
      } else if (item[name] != q[name]) {
        return false;
      }
    }
    return true;
  });
};
