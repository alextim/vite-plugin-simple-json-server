const allowedParameters = ['offset', 'limit', 'sort', 'count', 'order'];

export const getNames = (q: Record<string, any>, dataItem: Record<string, any>) =>
  Object.keys(q).filter((param) => allowedParameters.some((w) => w !== param && dataItem.hasOwnProperty(param)));

export const hasParam = (q: Record<string, any>) => Object.keys(q).some((param) => !allowedParameters.some((w) => w === param));
