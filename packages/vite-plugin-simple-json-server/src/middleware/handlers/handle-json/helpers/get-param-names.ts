const reservedNames = ['offset', 'limit', 'sort', 'count'];

export const getParamNames = (q: Record<string, any>) => Object.keys(q).filter((param) => !reservedNames.some((w) => w === param));

export const hasParams = (q: Record<string, any>) => Object.keys(q).some((param) => !reservedNames.some((w) => w === param));
