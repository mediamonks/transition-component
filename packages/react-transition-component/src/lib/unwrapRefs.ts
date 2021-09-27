import type { MutableRefObject, RefObject } from 'react';

/**
 * Unwraps react refs in object
 * @param refs
 * @returns
 */
export function unwrapRefs<T extends Record<string, unknown>>(
  refs: T,
): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [U in keyof T]: T[U] extends MutableRefObject<any> | RefObject<any> ? T[U]['current'] : T[U];
} {
  return Object.keys(refs).reduce((accumulator, key: keyof T) => {
    const value = refs[key];

    if (typeof value === 'object' && value != null && 'current' in value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accumulator[key] = (value as MutableRefObject<any> | RefObject<any>).current;
    } else {
      accumulator[key] = value;
    }

    return accumulator;
  }, refs);
}
