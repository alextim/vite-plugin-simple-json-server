export const isOurApi = (url: string | undefined, urlPrefixes: string[] | undefined) =>
  url && urlPrefixes && urlPrefixes.some((prefix) => url.startsWith(prefix));
