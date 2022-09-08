import _get from 'lodash.get';

export const searchPropDeep = (item: any, q: Record<string, any>, props: string[]) => {
  for (const prop of props) {
    const propValue = _get(item, prop);
    if (propValue === undefined || propValue === null) {
      return false;
    }
    if (Array.isArray(q[prop])) {
      if (!q[prop].some((val: any) => val == propValue)) {
        return false;
      }
    } else if (q[prop] != propValue) {
      return false;
    }
  }
  return true;
};
