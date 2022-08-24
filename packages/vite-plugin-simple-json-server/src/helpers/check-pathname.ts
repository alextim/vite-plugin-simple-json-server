import path from 'node:path';
import { isDirExists, isFileExists } from '../utils/files';
import { supportedMimes } from '../utils/mime-types';

const checkPathname = (pathname: string, mime: string) => {
  const name = (isDirExists(pathname) ? path.join(pathname, 'index') : pathname) + '.';

  const exts = supportedMimes[mime];

  for (const ext of exts) {
    if (isFileExists(name + ext)) {
      return name + ext;
    }
  }
  return '';
};

export default checkPathname;
