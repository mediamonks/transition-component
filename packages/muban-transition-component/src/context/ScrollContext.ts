import type gsap from 'gsap';

export const defaultScrollTriggerVariables: gsap.plugins.ScrollTriggerInstanceVars = {
  start: 'top 75%',
};

export class ScrollContext {
  public readonly scrollTriggerVariables: gsap.plugins.ScrollTriggerInstanceVars;

  public constructor(scrollTriggerVariables: gsap.plugins.ScrollTriggerInstanceVars = {}) {
    this.scrollTriggerVariables = {
      ...defaultScrollTriggerVariables,
      ...scrollTriggerVariables,
    };
  }
}
