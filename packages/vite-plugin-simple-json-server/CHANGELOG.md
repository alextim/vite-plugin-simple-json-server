# vite-plugin-simple-json-server

## 0.4.3

### Patch Changes

- aa0e90c: `Content-Type` header is removed for `204`

## 0.4.2

### Patch Changes

- ce91a1a: refactor logging

## 0.4.1

### Patch Changes

- c2e7b61: refactor: 204 status handling

## 0.4.0

### Minor Changes

- 1869675: ## Breaking

  CRUD (POST, PUT, PATCH, DELETE) operations for array-like JSON.

  ## Feature

  - `X-Total-Count` header in pagination

## 0.3.0

### Minor Changes

- b220dc4: ## Breaking

  - Only 'GET' for json.
  - Automatic route: `/json-file/count` is changed to `/json-file?count`.
  - Sort: the `order` parameter name is removed. Use `-` before parameter for the descending sort order.

  ## Features

  - Automatic route `/json-file/:id` for array-like json with `id` property.
  - Sorting by more more than one property: `/json-file?sort=name,-price`.
  - Paging: `prev`, `next`, `first` & `last` in the response header.

  ## Fixes

  - filter by multiply values of the same property: `/json-file?id=3&id=5`.

  ## Planned

  `POST`, `PUT` & `DELETE` for array-like json

## 0.2.3

### Patch Changes

- 74c478e: - By default the plugin is invoked only in `serve` mode.
  - It also works in preview mode.
  - Added `disable` option.

## 0.2.2

### Patch Changes

- 80ccdf7: - better error handling
  - refactor core code

## 0.2.1

### Patch Changes

- a225512: more supported types of static files

## 0.2.0

### Minor Changes

- fd4853b: "page" query param changed to "offset"

## 0.1.4

### Patch Changes

- d5ba4ec: refactor: json-handler messages

## 0.1.3

### Patch Changes

- 2381389: fix: paging

## 0.1.2

### Patch Changes

- 3bad40b: fix paging

## 0.1.1

### Patch Changes

- 205b733: release
