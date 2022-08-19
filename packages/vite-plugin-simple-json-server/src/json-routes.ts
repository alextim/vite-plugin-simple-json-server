import path from 'node:path';
import fs from 'node:fs';

const DATA_FOLDER = 'json';

const ENOENT = 2;

function toPosix(s: string) {
  return s.split(path.sep).join(path.posix.sep);
}

function removePrefixPath(p: string) {
  const i = p.indexOf(DATA_FOLDER);
  return p.substring(i + DATA_FOLDER.length);
}

type JsonRoute = {
  pattern: string;
  filePath: string;
};

function getJsonRoutes() {
  const routes: JsonRoute[] = [];

  function scan(folder: string) {
    const items = fs.readdirSync(folder);
    items.forEach((item) => {
      const stat = fs.statSync(path.join(folder, item));
      if (stat.isFile()) {
        const { name, ext } = path.parse(item);
        if (ext === '.json') {
          let pattern = toPosix(removePrefixPath(folder));
          pattern = name === 'index' ? pattern : path.posix.join(pattern, name);
          if (pattern.startsWith('/')) {
            pattern = pattern.substring(1);
          }
          routes.push({
            pattern,
            filePath: path.join(folder, item),
          });
        }
      } else {
        scan(path.join(folder, item));
      }
    });
  }

  try {
    scan(path.join(__dirname, '..', DATA_FOLDER));
  } catch (err: any) {
    if (err.code === ENOENT) {
      console.log(err.code);
    } else {
      console.error(err.message);
    }
  } finally {
    return routes;
  }
}

const jsonRoutes = getJsonRoutes();

export default jsonRoutes;
