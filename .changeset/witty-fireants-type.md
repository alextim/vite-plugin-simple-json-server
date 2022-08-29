---
"vite-plugin-simple-json-server": minor
---

## Breaking

- Only 'GET' for json.
- Automatic route: `/json-file/count` is changed to  `/json-file?count`.
- Sort: the `order` parameter name is removed. Use `-` before parameter for the descending sort order.

## Features

- Automatic route `/json-file/:id` for array-like json with `id` property.
- Sorting by more more than one property: `/json-file?sort=name,-price`.
- Paging: `prev`, `next`, `first` & `last` in the response header.

## Fixes

- filter by multiply values of the same property: `/json-file?id=3&id=5`.

## Planned

`POST`, `PUT` & `DELETE` for array-like json
