import type {
  CollectionRef,
  ComponentRef,
  ComponentsRef,
  ElementRef,
} from '@muban/muban/lib/refs/refDefinitions.types';

import type { BindProps } from '@muban/muban/lib/bindings/bindings.types';
import type { ComponentFactory } from '@muban/muban';
import type {
  SignatureRefCollection,
  SignatureRefElement,
} from '@mediamonks/core-transition-component';

export type TransitionRefCollection =
  | CollectionRef<HTMLElement, BindProps>
  | ComponentsRef<ComponentFactory>;

export type TransitionRefElement =
  | ElementRef<HTMLElement, BindProps>
  | ComponentRef<ComponentFactory>;

export type TransitionRef = TransitionRefCollection | TransitionRefElement;

export type SetupSignatureElements<T extends Record<string, TransitionRef>> = {
  [K in keyof T]: T[K] extends TransitionRefElement ? SignatureRefElement : SignatureRefCollection;
} & {
  container: HTMLElement;
};
