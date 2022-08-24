[![Help Ukraine now!](https://raw.githubusercontent.com/alextim/help-ukraine-win-flag/master/stop-russian-agressian-help-ukraine-now-link.svg 'Help Ukraine now!')](https://bank.gov.ua/en/about/support-the-armed-forces)

# vite-plugin-simple-json-server

Provide a file-based mock API for [Vite](https://vitejs.dev/) in dev mode.

![Release](https://github.com/alextim/vite-plugin-simple-json-server/actions/workflows/release.yaml/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

- <strong>[Why vite-plugin-simple-json-server](#why-vite-plugin-simple-json-server)</strong>
- <strong>[Installation](#installation)</strong>
- <strong>[Usage](#usage)</strong>
- <strong>[Configuration](#configuration)</strong>
- <strong>[Examples](#examples)</strong>
- <strong>[Contributing](#contributing)</strong>
- <strong>[Changelog](#changelog)</strong>
- <strong>[Inspirations](#inspirations)</strong>

---

## Why vite-plugin-simple-json-server?

This plugin is for lazy developers to create a mock API quickly. Simply place some json files into the `mock` folder and your file based API is ready. Out of the box you have pagination, sorting and filter.  

Additionally the plugin serves static files such as `html`, `js`, `css`, `txt`.  

As well you can define the custom route's handlers in the plugin config.

The plugin is light, it has only one dependency.

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

## Usage

Pagination and count is only available for array-based json.  

Otherwise, the server responds with 405.  

For sorting and filtering the json must be an array of objects.  

If filter or sort query parameter name is missing in the json then such parameter will be ignored.  

Let's have the `products.json` in the `mock` folder.

```json
[
  {
    "id": 1,
    "name": "Banana",
    "price": 2,
    "weight": 1
  },
  {
    "id": 2,
    "name": "Apple",
    "price": 2,
    "weight": 1
  },
  {
    "id": 3,
    "name": "Potato",
    "price": 2,
    "weight": 10
  },

  ...

]
```

### Pagination


Default limit is 10.

```sh
curl http://localhost:5173/products?offset=0


curl http://localhost:5173/products?offset=20


curl http://localhost:5173/products?offset=200&limit=100
```

### Sorting

Default sort order is `asc`.

```sh
curl http://localhost:5173/products?sort=name


curl http://localhost:5173/products?sort=name&order=desc
```

Only one field sorting is supported.

### Filtering

```sh
curl  http://localhost:5173/products?id=2


curl  http://localhost:5173/products?price=2&weight=1
```

The plugin supports only `eq`.

### Count

```sh
curl  http://localhost:5173/products/count


curl  http://localhost:5173/products/count?price=2
```
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
  <summary><strong>mockRootDir</strong></summary>

|   Type     | Required | Default value |
| :--------: | :------: | :-----------: |
|  `String`  |    No    |    `mock`     |

It's a subfolder under the Vite root. Place all your static files here.  

If the file name is `index.*` then its route will be the parent directory path.  

Html files are served first. 

|   Type                     | Supported methods |
| :------------------------: | :------------: |
| `json`                     | `GET`, `POST`  |
| `html` \| `htm` \| `shtml` | `GET`          |
| `js` \| `mjs`              | `GET`          |
| `css`                      | `GET`          |
| `txt` \| `text`            | `GET`          |

The server will respond with the 403 error for unsupported methods.

**`vite.config.ts`**

```js
import jsonServer from 'vite-plugin-simple-json-server';

export default {

  plugins: [
    jsonServer({
      mockRootDir: 'json-api',
    }),
  ],
};
```

</details>
  
<details>
  <summary><strong>urlPrefixes</strong></summary>

|   Type     | Required |  Default value  |
| :--------: | :------: | :-------------: |
| `String[]` |    No    | `[ '/api/' ]`   |

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

|    Type    | Required |           Default value           |
| :--------: | :------: | :-------------------------------: |
| `LogLevel` |    No    | `info`                            |

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

|    Type         | Required |           Default value           |
| :-------------: | :------: | :-------------------------------: |
| `MockHandler[]` |    No    | `undefined`                       |

Array of mock handlers.

The `MockHandler` type consists of `pattern`, `method` and `handle` fields.

**`pattern`**

`String`, required.  

Apache Ant-style path pattern.  It's done with [@howiefh/ant-path-matcher](https://www.npmjs.com/package/@howiefh/ant-path-matcher).;

The mapping matches URLs using the following rules:  

- `?` matches one character;
- `*` matches zero or more characters;
- `**` matches zero or more directories in a path;
- `{spring:[a-z]+}` matches the regexp `[a-z]+` as a path variable named `spring`.
  
**`method`** 

`String`, optional.  

Any HTTP method: `GET` | `POST` etc;

**`handle`**

`MockFunction`: `(req: Connect.IncomingMessage, res: ServerResponse, urlVars?: Record<string, string>): void`

- `req`: `Connect.IncomingMessage` from [Vite](https://github.com/vitejs/vite/blob/main/packages/vite/types/connect.d.ts);
- `res`: `ServerResponse` from [Node http](https://nodejs.org/api/http.html);
- `urlVars`: key-value pairs from parsed url.

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
            res.setHeader('Content-Type', 'application/json');
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

Number of items to return.  

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

## Examples

| Example  | Source                                                                                | Playground                                                                                                 |
| -------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| basic    | [GitHub](https://github.com/alextim/vite-plugin-simple-json-server/tree/main/examples/basic)    | [Play Online](https://stackblitz.com/fork/github/alextim/vite-plugin-simple-json-server/tree/main/examples/basic)    |

## Contributing

You're welcome to submit an issue or PR!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this plugin.

## Inspirations

- [vite-plugin-mock-server](https://github.com/enjoycoding/vite-plugin-mock-server)
