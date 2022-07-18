import type { GuardFunction } from '../types/transition.types';

// Helper method to guard functions to allow the flow to be hijacked and released when the
// user allows it.
export function guard(
  action: () => void,
  // eslint-disable-next-line no-shadow
  guard?: GuardFunction,
): ((release: () => void) => void) | void {
  if (guard) {
    guard(() => action());
  } else {
    action();
  }
}
