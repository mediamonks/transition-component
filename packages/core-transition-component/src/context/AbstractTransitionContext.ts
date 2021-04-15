import gsap from 'gsap';
import type {
  TransitionController,
  TransitionDirection,
  TransitionRef,
} from '../types/Transition.types';

/**
 * The transition context is used to reference the component's transition controllers through refs.
 * It should be initialized on the top level of your application, preferably in the App.vue so all child components
 * have access to the instance.
 */
export abstract class AbstractTransitionContext<T extends TransitionRef> {
  private readonly store: Array<{
    element: T;
    controller: TransitionController;
  }> = [];

  // Make sure this is overwritten to correctly retrieve the ref element
  protected abstract getRefElement(ref: T): HTMLElement | null;

  private getRefIndex(element: T): number {
    const target = this.getRefElement(element);
    return this.store.findIndex((item) => this.getRefElement(item.element) === target);
  }

  public unregister(element: T): void {
    const index = this.getRefIndex(element);
    if (index > -1) this.store.splice(index, 1);
  }

  public register(element: T, controller: TransitionController): void {
    const index = this.getRefIndex(element);

    const reference = {
      element,
      controller,
    };

    if (index >= 0) {
      this.store[index] = reference;
    } else {
      this.store.push(reference);
    }
  }

  public getTimeline(
    element: T | HTMLElement,
    direction: TransitionDirection = 'in',
  ): gsap.core.Timeline {
    return this.getController(element)?.getTimeline(direction) || gsap.timeline();
  }

  public getController(element: T | HTMLElement): TransitionController {
    const target = element instanceof HTMLElement ? element : this.getRefElement(element);

    const controller = this.store.find((item) => this.getRefElement(item.element) === target)
      ?.controller;

    if (!controller) {
      throw new Error('No controller was found for the provided element');
    }

    return controller;
  }
}
