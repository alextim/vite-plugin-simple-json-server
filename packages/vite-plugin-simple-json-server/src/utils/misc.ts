export function addSlashes(s: string) {
  if (!s.startsWith('/')) {
    s = `/${s}`;
  }
  if (!s.endsWith('/')) {
    s = `${s}/`;
  }
  return s;
}

export function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.substring(0, s.length - 1) : s;
}
