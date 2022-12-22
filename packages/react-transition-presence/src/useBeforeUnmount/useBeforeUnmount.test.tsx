import { renderHook } from '@testing-library/react';
import { useBeforeUnmount } from './useBeforeUnmount';

describe('useBeforeUnmount', () => {
  it('should not crash', () => {
    renderHook(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      useBeforeUnmount(() => {}, []);
    });
  });
});
