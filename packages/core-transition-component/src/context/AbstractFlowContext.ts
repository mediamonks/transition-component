import type { TransitionRef } from '../types/transition.types';
import type { AbstractTransitionContext } from './AbstractTransitionContext';

export abstract class AbstractFlowContext<T extends TransitionRef> {
  public transitionOut: Promise<void> | null = null;

  protected transitionContext: AbstractTransitionContext<T>;

  public constructor(transitionContext: AbstractTransitionContext<T>) {
    this.transitionContext = transitionContext;
  }

  /**
   * Create your own flow based on the used framework and Router.
   * @param element
   */
  public abstract start(element: T): void;
}
