import type { GuardFunction } from '../types/transition.types';

// Helper method to guard functions to allow the flow to be hijacked and released when the
// user allows it.
export function guard(action: () => void, _guard?: GuardFunction): void {
  if (_guard) {
    _guard(() => {
      action();
    });
  } else {
    action();
  }
}
