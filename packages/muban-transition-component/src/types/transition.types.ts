/* eslint-disable @typescript-eslint/no-redundant-type-constituents, unicorn/prevent-abbreviations */
import type {
  SetupPageTransitionOptions as CoreSetupPageTransitionOptions,
  SetupTransitionOptions as CoreSetupTransitionOptions,
  SetupTransitionSignature as CoreSetupTransitionSignature,
  SignatureRefCollection,
  SignatureRefElement,
} from '@mediamonks/core-transition-component';
import type {
  CollectionRef,
  ComponentFactory,
  ComponentRef,
  ComponentsRef,
  ElementRef,
} from '@muban/muban';

export type TransitionRefCollection = CollectionRef | ComponentsRef<ComponentFactory>;

export type TransitionRefElement = ElementRef | ComponentRef<ComponentFactory>;

export type TransitionRef = TransitionRefCollection | TransitionRefElement;

export type SetupSignatureElements<T extends Record<string, TransitionRef>> = {
  [K in keyof T]: T[K] extends TransitionRefElement ? SignatureRefElement : SignatureRefCollection;
} & {
  container: HTMLElement;
};

// Re-export these types so we get the correctly typed Muban refs
export type SetupTransitionSignature<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
> = CoreSetupTransitionSignature<T, R, E>;

export type SetupTransitionOptions<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
> = CoreSetupTransitionOptions<T, R, E>;

export type SetupPageTransitionOptions<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
> = CoreSetupPageTransitionOptions<T, R, E>;
