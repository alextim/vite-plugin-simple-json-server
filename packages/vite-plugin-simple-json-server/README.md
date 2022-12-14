[![Help Ukraine now!](https://raw.githubusercontent.com/alextim/help-ukraine-win-flag/master/stop-russian-agressian-help-ukraine-now-link.svg 'Help Ukraine now!')](https://war.ukraine.ua/support-ukraine/)

# vite-plugin-simple-json-server

Provide a file-based mock API for [Vite](https://vitejs.dev/) in dev mode.

![Release](https://github.com/alextim/vite-plugin-simple-json-server/actions/workflows/release.yaml/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

- <strong>[Why vite-plugin-simple-json-server](#why-vite-plugin-simple-json-server)</strong>
- <strong>[Installation](#installation)</strong>
- <strong>[Usage](#usage)</strong>
- <strong>[OpenAPI (Swagger)](#openapi-swagger)</strong>
- <strong>[Configuration](#configuration)</strong>
- <strong>[Examples](#examples)</strong>
- <strong>[Contributing](#contributing)</strong>
- <strong>[Changelog](#changelog)</strong>
- <strong>[Inspirations](#inspirations)</strong>

---

## Why vite-plugin-simple-json-server?

This plugin is for lazy developers to create a mock API quickly. Simply place some json files into the `mock` folder and your file based API is ready. Out of the box you have pagination, sorting, filter and basic **CRUD** operations.  

Additionally the plugin serves static files such as `html`, `js`, `css`, `txt`.  

As well you can define the custom route's handlers in the plugin config.

As bonus, you can visualize the [OpenAPI Specification](https://swagger.io/specification/) schema generated by the plugin in an interactive UI (Swagger) with zero efforts.

The plugin is lightweight and has only a few dependencies.  

---

## Installation

First, install the `vite-plugin-simple-json-server` package using your package manager.

```sh
# Using NPM
npm add -D vite-plugin-simple-json-server

# Using Yarn
yarn add -D vite-plugin-simple-json-server

# Using PNPM
pnpm add -D vite-plugin-simple-json-server
```

Then, apply this plugin to your `vite.config.*` file using the `plugins` property:

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  // ...
  plugins: [jsonServer()],
};
```

Then, restart the dev server.

This configuration assumes that all json files are in the `mock` folder under Vite root.  

To work correctly, the plugin requires Node version 15.7.0 or higher.

## Usage

The `vite-plugin-simple-json-server` injects own middleware into development and preview servers.
By default it is invoked only for `serve` mode.

The plugin first serves the handler routes, then the json API and at the very end, the static files.

Any query parameters are ignored for static files.

Pagination and count is only available for array-based json.
For sorting and filtering the json must be an array of objects.  

If there is a parameter in the filter or sort request that is not among the json fields, that parameter will be ignored.  

Let's have the `products.json` in the `mock` folder.

```json
[
  {
    "id": 1,
    "name": "Banana",
    "price": 2,
    "weight": 1,
    "packing": {
      "type": "box",
    }
  },
  {
    "id": 2,
    "name": "Apple",
    "price": 2,
    "weight": 1,
    "packing": {
      "type": "box",
    }
  },
  {
    "id": 3,
    "name": "Potato",
    "price": 2,
    "weight": 10,
    "packing": {
      "type": "bag",
    }
  },

  ...

]
```

### Pagination

Default limit is 10.

```sh
curl http://localhost:5173/products?offset=0


curl http://localhost:5173/products?offset=20
```

For the custom limit, pass it to the query:

```sh
curl http://localhost:5173/products?offset=200&limit=100
```

The server sets the `Link` response header with URLs for the **first**, **previous**, **next** and **last** pages according to the current `limit`. Also it sets the `X-Total-Count` header.

### Sorting

Default sort order is ascending.

```sh
curl http://localhost:5173/products?sort=name

```

For the descending order prefix a field name with `-`:

```sh
curl http://localhost:5173/products?sort=-name
```

Multiply field sorting is supported.  

```sh
curl http://localhost:5173/products?sort=name,-price

```

Use `.` to access deep properties.

```sh
curl http://localhost:5173/products?sort=packing.type
```

### Filtering

```sh
curl  http://localhost:5173/products?id=2


curl  http://localhost:5173/products?id=2&id=3


curl  http://localhost:5173/products?price=2&weight=1
```

If the requested resource has an `id` property, you can append the `id` value to the URL.

```sh
curl  http://localhost:5173/products/2

```

#### Deep properties

Use `.` to access deep properties.

```sh

curl  http://localhost:5173/products?packing.type=box
```

#### Operators

The plugin supports `ne`, `lt`, `gt`, `lte`, `gte` and `like` operators.

```sh

curl  http://localhost:5173/products?id[ne]=2

curl  http://localhost:5173/products?id[gt]=1&id[lt]=10


```

`Like` is performed via **RegExp**.

```sh

curl  http://localhost:5173/products?name[like]=ota

```

### Count

The count will be returned in the response header `X-Total-Count`.

```sh
curl -I http://localhost:5173/products
```

You can filter as well while count.

```sh
curl -I http://localhost:5173/products?price=2
```

:bulb: The pagination is available with sort and filter.

## CRUD

Full CRUD operations are only available for array-like JSON with a numeric `id` property.

### Array-like

| HTTP Verb | CRUD           | Entire Collection (e.g. `/products`)                                            | Specific Item (e.g. `/products/{id}`)                                                                               |
| :-------: |:-------------: | :------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| HEAD      | Read           | 204 (OK), items count in `X-Total-Count` header.                                |  405 (Method Not Allowed)                   |
| GET       | Read           | 200 (OK), list of items.<br>Use pagination, sorting and filtering to navigate large lists. |  <ul><li>200 (OK), single item.</li><li>404 (Not Found), if ID not found.</li></ul>                   |
| POST      | Create         | <ul><li>201 (Created), created item, `Location` header with link to `/products/{id}` containing new ID.</li><li>409 (Conflict) if resource already exists.</li><li>400 (Bad Request) for empty body, not valid JSON or too big body (>1e6)</li></ul> | 405 (Method Not Allowed).              |
| PUT       | Update/Replace | 405 (Method Not Allowed). | <ul><li>200 (OK), replaced item.</li><li>404 (Not Found), if ID not found.</li><li>400 (Bad Request) for empty body, not valid JSON or too big body (>1e6)</li></ul> |
| PATCH     | Update/Modify  | 405 (Method Not Allowed). | <ul><li>200 (OK), modified item.</li><li>404 (Not Found), if ID not found.</li><li>400 (Bad Request) for empty body, not valid JSON or too big body (>1e6)</li></ul> |
| DELETE    | Delete         | 405 (Method Not Allowed). | <ul><li>204 (OK)</li><li>404 (Not Found), if ID not found.</li></ul>                                                    |

### Object

| HTTP Verb | CRUD           | Entire Object (e.g. `/profile`)                       | Specific Item (e.g. `/profile/{id}`)   |
| :-------: |:-------------: | :------------------------------------------------------   | :------------------------------------- |
| GET       | Read           | 200 (OK), object.                                         | 404 (Not Found).                       |
| POST      | Create         | <ul><li>201 (Created), replaced object, `Location` header with link to `/profile`.</li><li>400 (Bad Request) for empty body, not valid JSON or too big body (>1e6)</li></ul> | 404 (Not Found). |
| PUT       | Update/Replace | 200 (OK), replaced object.                                | 404 (Not Found).              |
| PATCH     | Update/Modify  | 200 (OK), modified object.                                | 404 (Not Found).              |
| DELETE    | Delete         | 405 (Method Not Allowed).                                 | 404 (Not Found).              |


## OpenAPI (Swagger)

The plugin generates JSON according to the [OpenAPI Specification v3.0](https://swagger.io/specification/).  

It is available on `/{api}/v3/openapi.json` route.

Also you can explore your API directly on `/{api}/v3/openapi` page (Swagger UI).

To perform CRUD operations, the plugin assumes that each array-like JSON has a numeric `id` property.

## Configuration

To configure this plugin, pass an object to the `jsonServer()` function call in `vite.config.ts`.

**`vite.config.ts`**

```js
...
export default defineConfig({
  plugins: [jsonServer({
    handlers: ...
  })]
});
```

<details>
  <summary><strong>disable</strong></summary>

|  Type     | Required | Default value |
| :-------: | :------: | :-----------: |
| `Boolean` |    No    |  `false`      |

If `true` the plugin won't run its middleware while dev or preview.

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      disable: true,
    }),
  ],
};
```

</details>

<details>
  <summary><strong>mockDir</strong></summary>

|   Type     | Required | Default value |
| :--------: | :------: | :-----------: |
|  `String`  |    No    |    `mock`     |

It's a subfolder under the Vite root. Place all your JSON files here.  

If the file name is `index.*` then its route will be the parent directory path.  

|   Type                     | Supported methods |
| :------------------------: | :------------: |
| `json` (object)            | `GET`          |
| `json` (array-like)        | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| `html` \| `htm` \| `shtml` | `GET`          |
| `js` \| `mjs`              | `GET`          |
| `css`                      | `GET`          |
| `txt` \| `text`            | `GET`          |


**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {

  plugins: [
    jsonServer({
      mockDir: 'json-mock-api',
    }),
  ],
};
```

</details>

<details>
  <summary><strong>staticDir</strong></summary>

|   Type     | Required | Default value       |
| :--------: | :------: | :-----------------: |
|  `String`  |    No    | **options.mockDir** |

It's a subfolder under the Vite root. An alternative to the `mockDir` folder for static files such as `html`, `css` and `js`.  


**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {

  plugins: [
    jsonServer({
      staticDir: 'public',
    }),
  ],
};
```

</details>

<details>
  <summary><strong>urlPrefixes</strong></summary>

|   Type     | Required | Default value |
| :--------: | :------: | :-----------: |
| `String[]` |    No    | `[ '/api/' ]` |

Array of non empty strings.  

The plugin will look for requests starting with these prefixes.  

Slashes are not obligatory: plugin will add them automatically during option validation.  

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      urlPrefixes: [ 
        '/fist-api/', 
        '/second-api/',
      ],
    }),
  ],
};
```

</details>

<details>
  <summary><strong>noHandlerResponse404</strong></summary>

|  Type     | Required | Default value |
| :-------: | :------: | :-----------: |
| `Boolean` |    No    |  `true`       |

If its value is `false` the server won't respond with 404 error.

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      noHandlerResponse404: false,
    }),
  ],
};
```

</details>

<details>
  <summary><strong>logLevel</strong></summary>

|    Type    | Required | Default value |
| :--------: | :------: | :-----------: |
| `LogLevel` |    No    | `info`        |

Available values: `'info' | 'warn' | 'error' | 'silent'`;

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      logLevel: 'error',
    }),
  ],
};
```

</details>

<details>
  <summary><strong>handlers</strong></summary>

|    Type         | Required | Default value |
| :-------------: | :------: | :-----------: |
| `MockHandler[]` |    No    | `undefined`   |

For the custom routes. Array of mock handlers.

The `MockHandler` type consists of `pattern`, `method`, `handle` and `description` fields.

**`pattern`**

`String`, required.  

Apache Ant-style path pattern.  It's done with [@howiefh/ant-path-matcher](https://www.npmjs.com/package/@howiefh/ant-path-matcher).

The mapping matches URLs using the following rules:  

- `?` matches one character;
- `*` matches zero or more characters;
- `**` matches zero or more directories in a path;
- `{spring:[a-z]+}` matches the regexp `[a-z]+` as a path variable named `spring`.
  
**`method`**

`String`, optional.  

Any HTTP method: `GET` | `POST` etc;

`MockFunction`: `(req: Connect.IncomingMessage, res: ServerResponse, urlVars?: Record<string, string>): void`

- `req`: `Connect.IncomingMessage` from [Vite](https://github.com/vitejs/vite/blob/main/packages/vite/types/connect.d.ts);
- `res`: `ServerResponse` from [Node http](https://nodejs.org/api/http.html);
- `urlVars`: key-value pairs from parsed URL.

**`handle`**

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      handlers: [
        {
          pattern: '/api/hello/1',
          handle: (req, res) => {
            res.end(`Hello world! ${req.url}`);
          },
        },
        {
          pattern: '/api/hello/*',
          handle: (req, res) => {
            res.end(`Hello world! ${req.url}`);
          },
        },
        {
          pattern: '/api/users/{userId}',
          method: 'POST',
          handle: (req, res, urlVars) => {
            const data = [
              {
                url: req.url,
                urlVars
              },
            ];
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(data));
          },
        },
      ],
    }),
  ],
};
```

:exclamation: Handlers are served first. They intercept namesake file routes.

</details>

<details>
  <summary><strong>limit</strong></summary>

|   Type     | Required | Default value |
| :--------: | :------: | :-----------: |
|  `Number`  |    No    |    10         |

Number of items to return while paging.  

Usage:

```sh
curl http://localhost:5173/products?offset=300&limit=100
```

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      limit: 100,
    }),
  ],
};
```

</details>

<details>
  <summary><strong>delay</strong></summary>

|   Type     | Required | Default value |
| :--------: | :------: | :-----------: |
|  `Number`  |    No    |    0          |

Add delay to responses (ms).  

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {
  plugins: [
    jsonServer({
      delay: 1000,
    }),
  ],
};
```

</details>

## Examples

| Example | Source                                                                                | Playground                                                                                                 |
| ------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| basic   | [GitHub](https://github.com/alextim/vite-plugin-simple-json-server/tree/main/examples/basic) | [Play Online](https://stackblitz.com/fork/github/alextim/vite-plugin-simple-json-server/tree/main/examples/basic) |
| CRUD    | [GitHub](https://github.com/alextim/vite-plugin-simple-json-server/tree/main/examples/crud)  | [Play Online](https://stackblitz.com/fork/github/alextim/vite-plugin-simple-json-server/tree/main/examples/crud)  |

## Contributing

You're welcome to submit an issue or PR!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this plugin.

## Inspirations

- [vite-plugin-mock-server](https://github.com/enjoycoding/vite-plugin-mock-server)
