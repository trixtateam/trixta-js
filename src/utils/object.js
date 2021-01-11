/**
 *
 * @param {Object} obj  - object to inspect and find path value
 * @param {string} path - dot path notation for key in object
 * @param {any} fallback - default value if key is not found
 */
export function get(obj, path, fallback) {
  if (!obj) return fallback;
  const arr = typeof path === 'string' ? path.split('.') : path;
  const value = arr.reduce((xs, x) => (xs && xs[x] !== undefined ? xs[x] : undefined), obj);
  return value !== undefined ? value : fallback;
}
