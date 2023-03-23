export function shallowCompare(
  a: Record<string | number | symbol, unknown>,
  b: Record<string | number | symbol, unknown>,
): boolean {
  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  for (const key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
