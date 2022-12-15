import type {
  SignatureElement,
  SignatureRefCollection,
  SignatureRefElement,
} from '@mediamonks/core-transition-component';
import type {
  TransitionRef,
  TransitionRefCollection,
  TransitionRefElement,
} from '../types/transition.types';

export function transitionRefToElement(ref: TransitionRefElement): SignatureRefElement;
export function transitionRefToElement(ref: TransitionRefCollection): SignatureRefCollection;
export function transitionRefToElement(ref: TransitionRef): SignatureElement {
  if (ref.type === 'collection') {
    return [...ref.getElements()];
  }

  if (ref.type === 'componentCollection') {
    return ref.getComponents().map((component) => component.element);
  }

  if (ref.type === 'component') {
    return ref.component?.element;
  }

  return ref.element;
}
