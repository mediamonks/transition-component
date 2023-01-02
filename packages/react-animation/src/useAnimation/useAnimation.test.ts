import { renderHook } from '@testing-library/react';
import { gsap } from 'gsap';
import { useAnimation } from './useAnimation.js';

describe('useAnimation', () => {
  it('should not crash', () => {
    renderHook(() => useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []));
  });
});
