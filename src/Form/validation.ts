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
