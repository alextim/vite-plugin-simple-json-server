export function getFullUrl(req: any, urlPath: string) {
  const protocol = req.socket?.encrypted ? 's' : '';
  return `http${protocol}://${req.headers.host}${urlPath}`;
}
