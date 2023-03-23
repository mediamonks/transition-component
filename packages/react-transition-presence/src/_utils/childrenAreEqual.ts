import { type ReactElement, type ReactFragment } from 'react';
import { shallowCompare } from './shallowCompare.js';

export function childrenAreEqual(
  previousChildren: ReactElement | ReactFragment | null,
  nextChildren: ReactElement | ReactFragment | null,
): boolean {
  if (previousChildren === nextChildren) {
    return true;
  }

  if (
    (previousChildren === null && nextChildren !== null) ||
    (previousChildren !== null && nextChildren === null)
  ) {
    return false;
  }

  if (
    ('type' in previousChildren! && previousChildren.type) === // eslint-disable-line @typescript-eslint/no-non-null-assertion
    ('type' in nextChildren! && nextChildren.type) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  ) {
    if (
      'props' in previousChildren! && // eslint-disable-line @typescript-eslint/no-non-null-assertion
      'props' in nextChildren! // eslint-disable-line @typescript-eslint/no-non-null-assertion
    ) {
      return shallowCompare(previousChildren.props, nextChildren.props);
    }

    return true;
  }

  return false;
}
