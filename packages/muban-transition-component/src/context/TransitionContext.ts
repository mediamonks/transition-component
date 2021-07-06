import { AbstractTransitionContext } from '@mediamonks/core-transition-component';
import type { TransitionRefElement } from '../types/transition.types';

export class TransitionContext extends AbstractTransitionContext<TransitionRefElement> {
  // eslint-disable-next-line class-methods-use-this
  protected getRefElement(ref: TransitionRefElement): HTMLElement | null {
    if (ref.type === 'component') {
      return ref.component?.element || null;
    }

    return ref?.element || null;
  }
}
