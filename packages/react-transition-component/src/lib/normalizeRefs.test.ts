import type { RefObject } from 'react';
import { normalizeRefs } from './normalizeRefs';

describe('normalizeRefs', () => {
  it('Should normalize RefObject or MutableRefObject in object', () => {
    const myRef: RefObject<string> = {
      current: 'myRefString',
    };

    const refs = {
      notRef: 'myString',
      myRef,
    };

    expect(normalizeRefs(refs)).toEqual({
      notRef: 'myString',
      myRef: 'myRefString',
    });
  });
});
