import _get from 'lodash.get';

export const searchPropDeep = (item: any, q: Record<string, any>, params: string[]) => {
  for (const param of params) {
    const [prop, op] = parseParam(param);

    const propValue = _get(item, prop);
    if (propValue === undefined || propValue === null) {
      return false;
    }

    if (Array.isArray(q[param])) {
      if (!q[param].some((paramValue: any) => comp(propValue, paramValue, op))) {
        return false;
      }
    } else if (!comp(propValue, q[param], op)) {
      return false;
    }
  }
  return true;
};
const ops = ['ne', 'lt', 'gt', 'lte', 'gte', 'like'];

function parseParam(p: string) {
  const i = p.indexOf('[');
  if (i === -1) {
    return [p];
  }
  const name = p.substring(0, i);

  const j = p.indexOf(']', i);
  if (j === -1) {
    return [name];
  }
  const op = p.substring(i + 1, j);
  if (!op) {
    return [name];
  }
  if (!ops.some((val) => val === op)) {
    return [p];
  }
  return [name, op];
}

function comp(a: any, b: any, op: string) {
  switch (op) {
    case 'ne':
      return a != b;
    case 'lt':
      return a < b;
    case 'lte':
      return a <= b;
    case 'gt':
      return a > b;
    case 'gte':
      return a >= b;
    case 'like':
      return new RegExp(b, 'i').test(a.toString());
    default:
      return a == b;
  }
}
