import { createContext } from '@muban/muban';
import type ScrollTrigger from 'gsap/ScrollTrigger';

export const defaultScrollTriggerVariables: ScrollTrigger.Vars = {
  start: 'top 75%',
};

export class ScrollContext {
  public readonly scrollTriggerVariables: ScrollTrigger.Vars;

  public constructor(scrollTriggerVariables: ScrollTrigger.Vars = {}) {
    this.scrollTriggerVariables = {
      ...defaultScrollTriggerVariables,
      ...scrollTriggerVariables,
    };
  }
}

export const [provideScrollContext, useScrollContext] = createContext<ScrollContext | undefined>(
  'scrollContext',
);
