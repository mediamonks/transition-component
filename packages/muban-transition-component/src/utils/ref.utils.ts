/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CollectionRef,
  ComponentFactory,
  ComponentsRef,
  ElementRef,
  RefElementType,
} from '@muban/muban';
import type { AnyRef } from '@muban/muban/types/lib/refs/refDefinitions.types';

export function unwrapRef<T extends AnyRef<RefElementType>>(
  ref: T,
): T extends ElementRef<infer E>
  ? E
  : T extends CollectionRef<infer E>
  ? Array<E>
  : // The component ref doesn't support generic element types, therefore we just return HTMLElement like the library.
  T extends ComponentsRef<ComponentFactory>
  ? Array<HTMLElement>
  : HTMLElement | undefined {
  if (ref.type === 'element') {
    return ref?.element as any;
  }

  if (ref.type === 'collection') {
    return [...ref.getElements()] as any;
  }

  if (ref.type === 'componentCollection') {
    return [...ref.getComponents().map((component) => component?.element)] as any;
  }

  if (ref.type === 'component') {
    return ref.component?.element as any;
  }

  throw new Error('Unsupported ref type');
}

export function unwrapRefs<T extends Record<string, AnyRef<RefElementType>>>(
  refs: T,
): {
  [U in keyof T]: ReturnType<typeof unwrapRef<T[U]>>;
} {
  return Object.entries(refs).reduce(
    (accumulator, [key, ref]) => ({ ...accumulator, [key]: unwrapRef(ref) }),
    {} as any,
  );
}
