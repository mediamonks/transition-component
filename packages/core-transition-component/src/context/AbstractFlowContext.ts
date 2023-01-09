/* eslint-disable unicorn/prevent-abbreviations */
import type { TransitionRef } from '../types/transition.types.js';
import type { AbstractTransitionContext } from './AbstractTransitionContext.js';

export abstract class AbstractFlowContext<T extends TransitionRef> {
  public transitionOut: Promise<void> | null = null;

  public constructor(protected transitionContext: AbstractTransitionContext<T>) {}

  /**
   * Create your own flow based on the used framework and Router.
   * @param element
   */
  public abstract start(element: T): void;
}
