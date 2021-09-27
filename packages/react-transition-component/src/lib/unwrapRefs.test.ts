import type { RefObject } from 'react';
import { unwrapRefs } from './unwrapRefs';

describe('unwrapRefs', () => {
  it('Should normalize RefObject or MutableRefObject in object', () => {
    const myRef: RefObject<string> = {
      current: 'myRefString',
    };

    const refs = {
      notRef: 'myString',
      myRef,
    };

    expect(unwrapRefs(refs)).toEqual({
      notRef: 'myString',
      myRef: 'myRefString',
    });
  });
});
