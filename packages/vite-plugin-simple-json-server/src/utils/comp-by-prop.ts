import { SortOrder } from '../types';

const compare = (a: any, b: any) => {
  if (a > b) return 1;
  if (b > a) return -1;

  return 0;
};

export const compByProp = function (prop: string, order: SortOrder = 1) {
  return function (a: any, b: any) {
    if (!a.hasOwnProperty(prop) || !b.hasOwnProperty(prop)) {
      return 0;
    }
    return compare(a[prop], b[prop]) * order;
  };
};
