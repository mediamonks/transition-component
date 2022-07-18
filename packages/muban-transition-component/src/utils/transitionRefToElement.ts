import type {
  BindProps,
  CollectionRef,
  ComponentFactory,
  ComponentRef,
  ComponentsRef,
  ElementRef,
} from '@muban/muban';

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-explicit-any
export function transitionRefToElement<T extends ComponentFactory<any>>(
  ref: ComponentRef<T>,
): HTMLElement | undefined;
// eslint-disable-next-line no-redeclare
export function transitionRefToElement<T extends HTMLElement, P extends BindProps>(
  ref: ElementRef<T, P>,
): HTMLElement | undefined;

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-explicit-any
export function transitionRefToElement<T extends ComponentFactory<any>>(
  ref: ComponentsRef<T>,
): ReadonlyArray<HTMLElement> | undefined;
// eslint-disable-next-line no-redeclare
export function transitionRefToElement<T extends HTMLElement, P extends BindProps>(
  ref: CollectionRef<T, P>,
): ReadonlyArray<HTMLElement> | undefined;

// eslint-disable-next-line no-redeclare
export function transitionRefToElement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: ComponentRef<any> | ElementRef<any, any> | ComponentsRef<any> | CollectionRef<any, any>,
): HTMLElement | ReadonlyArray<HTMLElement> | undefined {
  if (ref.type === 'collection') {
    return [...ref.getElements()];
  }

  if (ref.type === 'componentCollection') {
    return [...ref.getComponents().map((component) => component?.element)];
  }

  if (ref.type === 'component') {
    return ref.component?.element;
  }

  return ref?.element;
}
