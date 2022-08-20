const reserved = ['page', 'limit', 'sort', 'order', 'count'];

export const getNames = (q: Record<string, any>, dataItem: Record<string, any>) =>
  Object.keys(q).filter((parameterName) => reserved.some((w) => w !== parameterName && dataItem.hasOwnProperty(parameterName)));
