import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import pkg from '../../../../package.json';

import { ILogger } from '@/services/logger';
import { send403, sendData, sendOptions } from '@/helpers/send';
import { HTML_MIME_TYPE } from '@/utils/mime-types';
import { removeTrailingSlash } from '@/utils/misc';

export function handleOpenApiIndex(req: Connect.IncomingMessage, res: ServerResponse, urlPath: string, logger: ILogger) {
  switch (req.method) {
    case 'OPTIONS':
      return sendOptions(res, ['GET'], ['OpenApi'], logger);
    case 'GET':
      const data = indexHtml(pkg.name, urlPath);
      return sendData(res, data, [], logger, 200, HTML_MIME_TYPE);
    default:
      return send403(res, [`Received: ${req.method}`], logger);
  }
}

const swaggerVer = '4.14.0';

function indexHtml(title: string, url: string) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>${title}</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${swaggerVer}/swagger-ui.css" />
  </head>
  <body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@${swaggerVer}/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '${removeTrailingSlash(url)}.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
  </body>
</html>
`;
}
