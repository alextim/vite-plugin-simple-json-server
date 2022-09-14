import path from 'node:path';

import { JSON_MIME_TYPE } from '../../../../utils/mime-types';
import getFilepath from '../../../../helpers/get-filepath';

export const parsePathname = (dataRoot: string, purePath: string) => {
  let pathname = path.join(dataRoot, purePath);

  let filePath = getFilepath(pathname, JSON_MIME_TYPE);
  if (filePath === false) {
    return false;
  }

  let idParam = '';
  let resourceName = purePath;
  if (filePath === '') {
    const index = purePath.lastIndexOf('/');
    if (index === -1) {
      return false;
    }
    resourceName = purePath.substring(0, index);
    pathname = path.join(dataRoot, resourceName);
    filePath = getFilepath(pathname, JSON_MIME_TYPE);
    if (!filePath) {
      return false;
    }
    idParam = purePath.substring(index + 1);
  }
  return { resourceName, idParam, filePath };
};
