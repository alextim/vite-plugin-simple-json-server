import path from 'node:path';
import { isDirExists, isFileExists } from '../utils/files';
import getMime, { supportedMimes } from '../utils/mime-types';

const getFilePath = (pathname: string, mime: string) => {
  if (isFileExists(pathname)) {
    const { ext } = path.parse(pathname);
    return getMime(ext.substring(1)) === mime ? pathname : '';
  }

  const name = (isDirExists(pathname) ? path.join(pathname, 'index') : pathname) + '.';

  const exts = supportedMimes[mime];

  for (const ext of exts) {
    if (isFileExists(name + ext)) {
      return name + ext;
    }
  }
  return '';
};

export default getFilePath;
