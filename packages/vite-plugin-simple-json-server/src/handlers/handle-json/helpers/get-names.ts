const reserved = ['offset', 'limit', 'sort', 'order'];

export const getNames = (q: Record<string, any>, dataItem: Record<string, any>) =>
  Object.keys(q).filter((parameterName) => reserved.some((w) => w !== parameterName && dataItem.hasOwnProperty(parameterName)));

export const hasParam = (q: Record<string, any>) => Object.keys(q).some((parameterName) => !reserved.some((w) => w === parameterName));
