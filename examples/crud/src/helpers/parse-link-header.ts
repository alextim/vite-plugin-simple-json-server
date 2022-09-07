export const parseLinkHeader = (s: string) => {
  if (!s) {
    return {};
  }
  return s
    .split(',')
    .map((item) => {
      const [rawUrl, rawRel] = item.split(';');
      const url = rawUrl.substring(1, rawUrl.length - 1);
      const rel = rawRel.substring(5, rawRel.length - 1);
      return [url, rel];
    })
    .reduce((prev: Record<string, string>, [url, rel]) => {
      prev[rel] = url;
      return prev;
    }, {});
};
