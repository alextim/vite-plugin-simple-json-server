import util from 'node:util';
import querystring from 'node:querystring';
import http from 'node:http';

export function getTemplate(req: any, urlPath: string, q: querystring.ParsedUrlQuery) {
  const protocol = req.socket?.encrypted ? 's' : '';

  delete q.offset;

  const qs = querystring.stringify(q);

  return `<http${protocol}://${req.headers.host}${urlPath}?${qs}&offset=%d>;rel="%s"`;
}

export function getLink(template: string, offset: number, limit: number, count: number) {
  const linkItems: string[] = [];

  // not is First
  if (offset !== 0) {
    linkItems.push(util.format(template, 0, 'prev'));
  }

  // not is last
  if (offset < count - limit) {
    linkItems.push(util.format(template, offset + limit, 'next'));
  }

  linkItems.push(util.format(template, 0, 'first'));
  linkItems.push(util.format(template, Math.floor(count / limit) * limit, 'last'));

  return linkItems.join(',');
}

export function setLinkHeader(res: http.ServerResponse, link: string, count: number) {
  if (res.hasHeader('Link')) {
    const prevLinkHeader = res.getHeader('Link');

    if (Array.isArray(prevLinkHeader)) {
      res.setHeader('Link', [...prevLinkHeader, link]);
      return;
    }

    if (prevLinkHeader !== undefined && prevLinkHeader !== '') {
      res.setHeader('Link', `${prevLinkHeader},${link}`);
      return;
    }
  }

  res.setHeader('X-Total-Count', count);
  res.setHeader('Link', link);
}
