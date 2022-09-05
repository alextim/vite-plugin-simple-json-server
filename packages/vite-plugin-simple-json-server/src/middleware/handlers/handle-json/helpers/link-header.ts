import util from 'node:util';
import querystring from 'node:querystring';

export function getLinkTemplate(req: any, urlPath: string, q: querystring.ParsedUrlQuery) {
  const protocol = req.socket?.encrypted ? 's' : '';

  delete q.offset;

  const qs = querystring.stringify(q);

  return `<http${protocol}://${req.headers.host}${urlPath}?${qs}&offset=%d>;rel="%s"`;
}

export function getLinks(template: string, offset: number, limit: number, count: number) {
  const linkItems: string[] = [];

  // not First
  if (offset !== 0) {
    linkItems.push(util.format(template, Math.max(0, offset - limit), 'prev'));
  }

  // not last
  if (offset < count - limit) {
    linkItems.push(util.format(template, offset + limit, 'next'));
  }

  linkItems.push(util.format(template, 0, 'first'));
  linkItems.push(util.format(template, offset + (Math.ceil((count - offset) / limit) - 1) * limit, 'last'));

  return linkItems.join(',');
}
