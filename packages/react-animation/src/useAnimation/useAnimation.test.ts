import { renderHook } from '@testing-library/react';
import gsap from 'gsap';
import { useAnimation } from './useAnimation';

describe('useAnimation', () => {
  it('should not crash', () => {
    renderHook(() => useAnimation(() => gsap.timeline(), []));
  });
});
