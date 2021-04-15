import type { GuardFunction } from '../types/Transition.types';

// Helper method to guard functions to allow the flow to be hijacked and released when the
// user allows it.
export function Guard(
  action: () => void,
  guard?: GuardFunction,
): ((release: () => void) => void) | void {
  if (guard) {
    guard(() => action());
  } else {
    action();
  }
}
