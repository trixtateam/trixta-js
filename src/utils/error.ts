import { TrixtaErrorResponse } from '../React/types/common';

/**
 * Based on the contents of the error object will attempt to return a message
 * @param error
 * @returns {string|*}
 */
export function getMessageFromError(error: TrixtaErrorResponse): string {
  if (error.message) {
    return error.message;
  }
  if (error.reason) {
    return error.reason;
  }
  return JSON.stringify(error);
}
