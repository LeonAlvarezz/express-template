export function isString(value: unknown) {
  return typeof value === "string";
}

export function isBool(value: unknown) {
  return typeof value === "boolean";
}

export function isNumber(value: unknown) {
  return typeof value === "number" && !isNaN(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}
