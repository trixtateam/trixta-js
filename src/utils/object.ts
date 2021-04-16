/**
 * Returns true or false if the variable passed is an object
 * @param {any} variable - anything to check if is object
 */
export function isObject(variable: unknown): variable is Dict {
  return variable !== undefined && Object.prototype.toString.call(variable) === '[object Object]';
}

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function pickBy(
  object: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  predicate = (value: unknown, key: string) => value,
) {
  if (object === null) return {};
  return (
    Object.entries(object)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => predicate(value, key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  );
}

/**
 *
 * @param {Object} obj  - object to inspect and find path value
 * @param {string} path - dot path notation for key in object
 * @param {any} fallback - default value if key is not found
 */
export function get<TReturn = unknown | undefined, TFallback = TReturn>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: object | null,
  path: string | string[],
  fallback?: TFallback,
): TReturn | TFallback {
  if (!obj) return fallback as TFallback;
  const arr = typeof path === 'string' ? path.split('.') : path;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const valueFromPath = arr.reduce<any>(
    (accumulator, currentValue) =>
      accumulator && accumulator[currentValue] !== undefined
        ? accumulator[currentValue]
        : undefined,
    obj,
  );
  return valueFromPath !== undefined ? valueFromPath : fallback;
}
