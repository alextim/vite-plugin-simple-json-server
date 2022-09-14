const contentApiError = {
  'application/json': {
    schema: {
      $ref: '#/components/schemas/ApiErrorResponse',
    },
  },
};
const code400 = {
  description: 'Bad Request: in case of empty body, not valid JSON or too big body (>1e6)',
  content: contentApiError,
};

const code404 = {
  description: 'Resource with `id` not found',
  content: contentApiError,
};

export const code409 = {
  description: 'Resource with `id` already exists',
  content: contentApiError,
};

export const code415 = {
  description: 'Unsupported Media Type',
  content: contentApiError,
};

const options = {
  responses: {
    204: {
      description: 'Success',
      headers: {
        allow: {
          description: 'Commas-separated allowed methods list',
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const operationsStatic = {
  get: {
    responses: {
      200: {
        description: 'Success',
        content: {},
      },
    },
  },
};

export const operationsAllTable = {
  head: {
    responses: {
      204: {
        description: 'Success',
        headers: {
          'X-Total-Count': {
            description: 'The number of items matching filter criteria',
            schema: {
              type: 'integer',
            },
          },
        },
      },
    },
  },
  get: {
    parameters: [
      {
        name: 'sort',
        in: 'query',
        description: 'List of fields separated by commas. Use `-` before the field name for descending sort order',
        required: false,
        explode: false,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        style: 'form',
      },
      {
        name: 'offset',
        in: 'query',
        description: 'The number of items to skip.',
        required: false,
        explode: false,
        schema: {
          type: 'integer',
          format: 'int64',
          minimum: 0,
        },
        style: 'form',
      },
      {
        name: 'limit',
        in: 'query',
        description: 'The maximum number of items to return in the response.',
        required: false,
        explode: false,
        schema: {
          type: 'integer',
          format: 'int64',
          minimum: 0,
        },
        style: 'form',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/{placeholder}',
              },
            },
          },
        },
      },
    },
  },
  post: {
    requestBody: {
      required: true,
      description: 'create new object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Success',
        headers: {
          Link: {
            description: 'Link to created resource',
            schema: {
              type: 'string',
            },
          },
        },
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
      409: code409,
      415: code415,
    },
  },
  options,
};

export const operationsAllObject = {
  get: {
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
    },
  },
  post: {
    requestBody: {
      required: true,
      description: 'create new object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Success',
        headers: {
          Link: {
            description: 'Link to created resource',
            schema: {
              type: 'string',
            },
          },
        },
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
      415: code415,
    },
  },
  options,

  put: {
    requestBody: {
      required: true,
      description: 'replace object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
    },
  },

  patch: {
    requestBody: {
      required: true,
      description: 'modify object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
    },
  },
};

const idParameter = {
  name: 'id',
  in: 'path',
  description: 'ID of resource to return',
  required: true,
  schema: {
    type: 'integer',
    format: 'int64',
    minimum: 0,
  },
};

export const operationsGetById = {
  get: {
    parameters: [idParameter],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      404: code404,
    },
  },
  options,
  put: {
    parameters: [{ ...idParameter, description: 'ID of resource to replace' }],
    requestBody: {
      required: true,
      description: 'replace object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
      404: code404,
      415: code415,
    },
  },
  patch: {
    parameters: [{ ...idParameter, description: 'ID of resource to modify' }],
    requestBody: {
      required: true,
      description: 'modify object',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{placeholder}',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/{placeholder}',
            },
          },
        },
      },
      400: code400,
      404: code404,
      415: code415,
    },
  },
  delete: {
    parameters: [{ ...idParameter, description: 'ID of resource to delete' }],
    responses: {
      200: {
        description: 'Success, returns empty object',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/EmptyObject',
            },
          },
        },
      },
      404: code404,
    },
  },
};
