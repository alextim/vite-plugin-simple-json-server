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

export function setLinkHeader(res: http.ServerResponse, link: string, count: number) {
  let value: string | string[] = link;
  if (res.hasHeader('Link')) {
    const prevLinkHeader = res.getHeader('Link');

    if (Array.isArray(prevLinkHeader)) {
      value = [...prevLinkHeader, link];
    } else if (prevLinkHeader !== undefined && prevLinkHeader !== '') {
      value = `${prevLinkHeader},${link}`;
    }
  }

  res.setHeader('X-Total-Count', count);
  res.setHeader('Link', value);
}
