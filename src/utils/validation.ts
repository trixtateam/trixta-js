import { isObject } from './object';

/*
 * Returns true if the value if null or undefined or empty
 * @param value
 * @returns {boolean}
 */
export function isNullOrEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (value === true || value === false) return false;
  if (
    !Number.isInteger(value) &&
    isObject(value) &&
    Object.keys(value).length === 0
  )
    return true;
  if (String(value).length === 0) return true;
  return false;
}

export function isJsonSchemaFormInstalled(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-var-requires
    const rjsf = require('@rjsf/core');
    if (rjsf) return true;
    return false;
  } catch (er) {
    return false;
  }
}
