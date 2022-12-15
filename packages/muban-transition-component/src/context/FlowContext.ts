import { AbstractFlowContext } from '@mediamonks/core-transition-component';
import type { TransitionRefElement } from '../types/transition.types';
import { transitionRefToElement } from '../util/transition.utils';

export class FlowContext extends AbstractFlowContext<TransitionRefElement> {
  public async start(
    element: TransitionRefElement,
    // TODO: Implement when we have some sort of router.
    // ...[to, from, next]: Parameters<NavigationGuard>
  ): Promise<void> {
    if (transitionRefToElement(element) === undefined) {
      throw new Error('Unable to start the flow because the element is null');
    }

    const transitionController = this.transitionContext.getController(element);

    // Trigger the transition out and store the Promise reference so we can listen to it on the new page that will load.
    this.transitionOut = transitionController.transitionOut();

    // Wait for the transition to be completed
    await this.transitionOut;

    // Make sure we release the flow so the next page can appear
    // next();
  }
}
