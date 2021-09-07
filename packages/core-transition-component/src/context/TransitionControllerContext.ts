import type {
  TransitionController,
  TransitionDirection,
  TransitionOptions,
} from '../types/transition.types';

export class TransitionControllerContext {
  /**
   * Set of TransitionControllers that are active in the document.
   *
   * We're using a Set so that we don't accidentally get duplicated
   * controllers in the context
   */
  public readonly transitionControllers = new Set<TransitionController>();

  /**
   * Adds transitionController to transitionControllers Set
   *
   * @param transitionController
   */
  public addTransitionController(transitionController: TransitionController): void {
    this.transitionControllers.add(transitionController);
  }

  /**
   * Deletes transitionController to transitionControllers Set
   *
   * @param transitionController
   */
  public deleteTransitionController(transitionController: TransitionController): void {
    this.transitionControllers.delete(transitionController);
  }

  /**
   * Finds transitionController with given ref
   *
   * @param ref
   * @returns
   */
  public findTransitionController(ref: unknown): TransitionController | undefined {
    return Array.from(this.transitionControllers).find(
      (transitionController) => transitionController.ref === ref,
    );
  }

  /**
   * Starts transition for all transition controllers
   *
   * @param transitionOptions
   */
  public async transition(transitionOptions: TransitionOptions): Promise<void> {
    await Promise.all(
      Array.from(this.transitionControllers).map((controller) =>
        controller.transition(transitionOptions),
      ),
    );
  }

  /**
   * Kills transition for all transition controllers
   *
   * @param direction
   */
  public killTransition(direction: TransitionDirection): void {
    this.transitionControllers.forEach((transitionController) =>
      transitionController.transitionTimeline[direction].kill(),
    );
  }
}

/**
 * Global transition controller context
 */
export const TRANSITION_CONTROLLER_CONTEXT = new TransitionControllerContext();
