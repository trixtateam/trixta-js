/**
 * Based on the contents of the error object will attempt to return a message
 * @param error
 * @returns {string|*}
 */
export function getMessageFromError(error) {
  if (error.message) {
    return error.message;
  }
  if (error.reason) {
    return error.reason;
  }
  return JSON.stringify(error);
}
