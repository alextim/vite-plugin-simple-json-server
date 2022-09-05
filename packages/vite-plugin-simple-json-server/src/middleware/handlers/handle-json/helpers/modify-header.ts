import http from 'node:http';

export function modifyHeader(res: http.ServerResponse, key: string, value: any) {
  if (!res.hasHeader(key)) {
    res.setHeader(key, value);
    return;
  }

  const prev = res.getHeader(key);

  if (Array.isArray(prev)) {
    res.setHeader(key, [...prev, value]);
    return;
  }
  res.setHeader(key, prev ? `${prev},${value}` : value);
}
