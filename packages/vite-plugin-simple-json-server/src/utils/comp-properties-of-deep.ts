import _get from 'lodash.get';

type sortArg<T> = keyof T | `-${string & keyof T}`;

export function compPropertiesOfDeep<T extends object>(sortBy: Array<sortArg<T>>) {
  function compareByProperty(arg: sortArg<T>) {
    let key: keyof T;
    let sortOrder = 1;
    if (typeof arg === 'string' && arg.startsWith('-')) {
      sortOrder = -1;
      // Typescript is not yet smart enough to infer that substring is keyof T
      key = arg.substring(1) as keyof T;
    } else {
      // Likewise it is not yet smart enough to infer that arg is not keyof T
      key = arg as keyof T;
    }
    return function (a: T, b: T) {
      const val_a = _get(a, key);
      if (val_a === undefined || val_a === null) {
        return 0;
      }
      const val_b = _get(b, key);
      if (val_b === undefined || val_b === null) {
        return 0;
      }
      const result = val_a < val_b ? -1 : val_a > val_b ? 1 : 0;

      return result * sortOrder;
    };
  }

  return function (obj1: T, obj2: T) {
    let i = 0;
    let result = 0;
    const numberOfProperties = sortBy?.length;
    while (result === 0 && i < numberOfProperties) {
      result = compareByProperty(sortBy[i])(obj1, obj2);
      i++;
    }

    return result;
  };
}

export function sortDeep<T extends object>(arr: T[], ...sortBy: Array<sortArg<T>>) {
  return arr.sort(compPropertiesOfDeep<T>(sortBy));
}
