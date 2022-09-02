export const getParams = (q: Record<string, string | string[] | undefined>, defaultLimit: number) => {
  const { count, offset: srcOffset, limit: srcLimit, sort: srcSort, ...srcFilterParams } = q;

  const filterParams = getFilterParams(srcFilterParams);
  const isCount = count !== undefined;

  if (isCount) {
    return { isCount, filterParams };
  }

  let offset: number | undefined = undefined;
  let limit: number | undefined = undefined;
  const sortParams: string[] = [];

  if (srcOffset) {
    offset = Math.max(0, parseInt(Array.isArray(srcOffset) ? srcOffset[0] : srcOffset));
  }

  if (srcLimit) {
    limit = Math.max(0, parseInt(Array.isArray(srcLimit) ? srcLimit[0] : srcLimit));
  }

  if (offset !== undefined || limit !== undefined) {
    if (offset === undefined) {
      offset = 0;
    }
    if (limit === undefined || limit === 0) {
      limit = defaultLimit;
    }
  }

  if (srcSort) {
    const parseSortParam = (value: string) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    if (Array.isArray(srcSort)) {
      sortParams.push(...srcSort.map(parseSortParam).flat());
    } else {
      sortParams.push(...parseSortParam(srcSort));
    }
  }

  return { isCount, offset, limit, sortParams, filterParams };
};

function getFilterParams(src: Record<string, string | string[] | undefined>): Record<string, string | string[]> | undefined {
  let result: Record<string, string | string[]> | undefined = undefined;
  Object.entries(src).forEach(([key, value]) => {
    if (value !== undefined) {
      if (!result) {
        result = {};
      }
      result[key] = value;
    }
  });
  return result;
}
