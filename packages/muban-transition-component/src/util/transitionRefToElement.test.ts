import type { ComponentFactory } from '@muban/muban';
import {
  createApp,
  defineComponent,
  refCollection,
  refComponent,
  refComponents,
  refElement,
} from '@muban/muban';
import type { BindProps } from '@muban/muban/lib/bindings/bindings.types';
import type {
  CollectionRef,
  ComponentRef,
  ComponentsRef,
  ElementRef,
} from '@muban/muban/lib/refs/refDefinitions.types';
import { html } from '@muban/template';
import { transitionRefToElement } from './transitionRefToElement';

const SomeComponent = defineComponent({
  name: 'component',
});

const App = defineComponent({
  name: 'app',
  refs: {
    element: refElement('element'),
    elements: refCollection('elements'),
    component: refComponent(SomeComponent, {
      ref: 'component',
    }),
    components: refComponents(SomeComponent, {
      ref: 'components',
    }),
  },
});

const app = createApp(App);

app.mount(
  document.createElement('div'),
  () => html`<div data-component="app">
    <span data-ref="element"></span>
    <span data-ref="elements"></span>
    <span data-ref="elements"></span>
    <span data-component="component" data-ref="component"></span>
    <span data-component="component" data-ref="components"></span>
    <span data-component="component" data-ref="components"></span>
  </div>`,
);

// eslint-disable-next-line no-underscore-dangle
const { element, elements, component, components } = app._instance?.refs;

describe('transitionRefToElement', () => {
  it('Should return HTMLElement for Muban element for refElement', () => {
    const result = transitionRefToElement(element as ElementRef<HTMLSpanElement, BindProps>);
    expect(result?.tagName).toBe('SPAN');
  });

  it('Should return HTMLElement for Muban component for refComponent', () => {
    const result = transitionRefToElement(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component as ComponentRef<ComponentFactory<any>>,
    );
    expect(result?.tagName).toBe('SPAN');
  });

  it('Should return array of HTMLElements for refCollection', () => {
    const results = transitionRefToElement(elements as CollectionRef<HTMLSpanElement, BindProps>);
    expect(results.length).toBe(2);
  });

  it('Convert return array of HTMLElements for refComponents', () => {
    const results = transitionRefToElement(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components as ComponentsRef<ComponentFactory<any>>,
    );
    expect(results.length).toBe(2);
  });
});
