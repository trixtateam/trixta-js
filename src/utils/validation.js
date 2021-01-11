import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

/*
 * Returns true if the value if null or undefined or empty
 * @param value
 * @returns {boolean}
 */
export function isNullOrEmpty(value) {
  if (isNull(value)) {
    return true;
  }
  if (isUndefined(value)) {
    return true;
  }
  if (isArray(value) && isEmpty(value)) {
    return true;
  }
  if (!Number.isInteger(value) && Object.keys(value).length === 0) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }

  return false;
}
