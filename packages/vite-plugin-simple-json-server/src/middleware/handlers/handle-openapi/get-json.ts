import path from 'node:path';

import pkg from '../../../../package.json';
import { SimpleJsonServerPluginOptions } from '../../../types';

import { scanDir } from '@/utils/scan-dir';
import getMime, { JSON_MIME_TYPE, supportedMimes } from '@/utils/mime-types';
import { JsonTable } from '@/services/json-table';

import { operationsAllObject, operationsAllTable, operationsGetById, operationsStatic } from './operations';
import { getJsonSchema } from '@/utils/json-schema';

const openApiVer = '3.0';
const regex = /[^{}]+(?=\})/g;

const SEP = ' #';

const clone = (o: object) => JSON.parse(JSON.stringify(o));

const toSchemaName = (name: string) => name.replace(SEP, '-');

const getPathItem = (o: object, name: string) => {
  const opts = clone(o);

  for (const method of Object.keys(opts)) {
    const schemaRef = `#/components/schemas/${toSchemaName(name)}`;

    opts[method].tags = [name];
    if (method === 'get') {
      const schema = opts[method].responses[200].content['application/json'].schema;
      if (schema.items) {
        schema.items.$ref = schemaRef;
      } else {
        schema.$ref = schemaRef;
      }
    } else if (method === 'put' || method === 'patch' || method === 'post') {
      opts[method].requestBody.content['application/json'].schema.$ref = schemaRef;
      opts[method].responses[method === 'post' ? 201 : 200].content['application/json'].schema.$ref = schemaRef;
    }
  }
  return opts;
};

const getPatternFromPath = (mockRoot: string, file: string, isIndex: boolean = false, ext: string = '') => {
  let pattern = file.substring(mockRoot.length, file.length - ext.length).replaceAll('\\', '/');
  if (isIndex) {
    pattern = pattern.split('/').slice(0, -1).join('/');
  }
  return pattern || '/';
};

const getName = (name: string, tags: { name: string }[]) => {
  const tag = tags.find((el) => el.name === name);
  if (!tag) {
    return name;
  }
  const template = `${name}${SEP}`;
  const nextId = tags.reduce((prev, curr) => {
    if (curr.name.startsWith(template)) {
      return Math.max(parseInt(curr.name.substring(template.length)) + 1, prev);
    }
    return prev;
  }, 0);
  return `${name}${SEP}${nextId}`;
};

const swaggerMethods = ['get', 'put', 'patch', 'post', 'delete', 'options', 'trace', 'head'];
const idDefaultSchema = {
  type: 'integer',
  format: 'int64',
};

export async function getJson(mockRoot: string, staticRoot: string, options: SimpleJsonServerPluginOptions) {
  const tags: { name: string; description?: string }[] = [];
  const paths: Record<string, any> = {};
  const schemas: Record<string, any> = {};

  const { urlPrefixes, handlers } = options;
  handlers?.forEach(({ pattern: srcPattern, method }, i) => {
    for (const prefix of urlPrefixes!) {
      if (srcPattern.startsWith(prefix)) {
        const pattern = srcPattern.substring(prefix.length - 1);
        const parameters = pattern.match(regex)?.map((name) => ({ name, in: 'path' }));

        const name = `handler${SEP}${i}`;
        tags.push({ name });

        const methods = method ? [method] : swaggerMethods;
        paths[pattern] = {};
        methods.forEach((m) => {
          paths[pattern][m.toLowerCase()] = {
            tags: [name],
            parameters,
          };
        });

        break;
      }
    }
  });

  const jsonFiles = (await scanDir(mockRoot)).filter((file) =>
    supportedMimes[JSON_MIME_TYPE].some((mime) => mime === path.extname(file).substring(1)),
  );

  for (const file of jsonFiles) {
    const { name: basename, ext } = path.parse(file);

    const pattern = getPatternFromPath(mockRoot, file, basename === 'index', ext);

    const name = getName(basename, tags);

    tags.push({ name, description: file });

    const tbl = new JsonTable(file);
    await tbl.load();

    const sample = tbl.getFirst();
    const schema = getJsonSchema(sample);
    schemas[toSchemaName(name)] = schema;

    if (tbl.isTable()) {
      if (!schema.properties.id || schema.properties.id.type === 'number') {
        schema.properties.id = idDefaultSchema;
        schema.required = ['id'];
      }
      paths[pattern] = getPathItem(operationsAllTable, name);
      paths[`${pattern}/{id}`] = getPathItem(operationsGetById, name);
    } else {
      paths[pattern] = getPathItem(operationsAllObject, name);
    }
  }

  const staticFiles = await scanDir(staticRoot);

  for (const file of staticFiles) {
    const ext = path.extname(file).substring(1);
    const mime = getMime(ext);
    if (mime) {
      const basename = path.basename(file);
      const pattern = getPatternFromPath(staticRoot, file);
      const name = getName(basename, tags);

      tags.push({ name, description: file });

      const operations: Record<string, any> = clone(operationsStatic);

      operations.get.tags = [name];
      operations.get.responses[200].content = {
        [mime]: {
          schema: {
            type: 'string',
          },
        },
      };

      paths[pattern] = operations;
    }
  }

  return {
    openapi: `${openApiVer}.3`,
    info: {
      title: `${pkg.name} - OpenAPI ${openApiVer}`,
      description: `This is a api description exposed by ${pkg.name} based on the OpenAPI ${openApiVer} specification.`,
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      version: pkg.version,
    },
    externalDocs: {
      description: `Find out more about ${pkg.name}`,
      url: pkg.homepage,
    },
    servers: urlPrefixes!.map((url) => ({ url })),
    tags,
    paths,
    components: {
      schemas: {
        ...schemas,
        EmptyObject: {
          type: 'object',
          properties: {},
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  };
}
