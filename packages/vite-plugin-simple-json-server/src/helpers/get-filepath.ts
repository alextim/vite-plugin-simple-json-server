import path from 'node:path';
import { isDirExists, isFileExists } from '../utils/files';
import getMime, { supportedMimes } from '../utils/mime-types';

const getFilePath = (pathname: string, mime: string) => {
  if (isFileExists(pathname)) {
    const { ext } = path.parse(pathname);
    return getMime(ext.substring(1)) === mime ? pathname : false;
  }

  let name: string;
  if (isDirExists(pathname)) {
    name = path.join(pathname, 'index');
  } else {
    name = pathname;
  }
  name += '.';

  for (const ext of supportedMimes[mime]) {
    if (isFileExists(name + ext)) {
      return name + ext;
    }
  }
  return '';
};

export default getFilePath;
