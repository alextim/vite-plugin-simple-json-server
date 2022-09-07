import util from 'node:util';

export function getLinks(template: string, offset: number, limit: number, totalCount: number) {
  if (limit >= totalCount) {
    return '';
  }
  const linkItems: string[] = [];

  // not First
  // prev
  if (offset !== 0) {
    linkItems.push(util.format(template, Math.max(0, offset - limit), 'prev'));
  }

  // not last
  // next
  if (offset < totalCount - limit) {
    linkItems.push(util.format(template, offset + limit, 'next'));
  }

  // first
  linkItems.push(util.format(template, 0, 'first'));
  // last
  linkItems.push(util.format(template, offset + (Math.ceil((totalCount - offset) / limit) - 1) * limit, 'last'));

  return linkItems.join(',');
}
