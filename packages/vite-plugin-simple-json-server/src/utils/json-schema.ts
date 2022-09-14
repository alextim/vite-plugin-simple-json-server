const isPlainObject = (obj: any) => (obj ? typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype : false);
const supportType = ['string', 'number', 'array', 'object', 'boolean', 'integer'];
const isSchema = (object: any) => supportType.indexOf(object.type) !== -1;

function getType(type: any) {
  if (type === 0) {
    return 'number';
  }
  if (!type) {
    return 'string';
  }
  return supportType.indexOf(type) !== -1 ? type : typeof type;
}

function handleSchema(json: any, schema: Record<string, any>) {
  Object.assign(schema, json);
  if (schema.type === 'object') {
    delete schema.properties;
    parse(json.properties, schema);
  }
  if (schema.type === 'array') {
    delete schema.items;
    schema.items = {};
    parse(json.items, schema.items);
  }
}

function handleArray(arr: any[], schema: Record<string, any>) {
  schema.type = 'array';
  const props = (schema.items = {});
  parse(arr[0], props);
}

function handleObject(json: any, schema: Record<string, any>) {
  if (isSchema(json)) {
    return handleSchema(json, schema);
  }
  schema.type = 'object';
  schema.properties = {};
  const props = schema.properties;
  for (const key in json) {
    props[key] = {};
    parse(json[key], props[key]);
  }
}

function parse(json: any, schema: Record<string, any>) {
  if (Array.isArray(json)) {
    handleArray(json, schema);
    return;
  }
  if (isPlainObject(json)) {
    handleObject(json, schema);
    return;
  }
  schema.type = getType(json);
}

export function getJsonSchema(data: any) {
  const jsonSchema: Record<string, any> = {};
  parse(data, jsonSchema);
  return jsonSchema;
}
