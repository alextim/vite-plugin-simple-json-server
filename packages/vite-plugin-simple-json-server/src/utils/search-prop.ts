export const searchProp = (item: any, q: Record<string, any>, props: string[]) => {
  for (const prop of props) {
    if (!item.hasOwnProperty(prop)) {
      return false;
    }
    if (Array.isArray(q[prop])) {
      if (!q[prop].some((val: any) => val == item[prop])) {
        return false;
      }
    } else if (item[prop] != q[prop]) {
      return false;
    }
  }
  return true;
};
