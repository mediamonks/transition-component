/* eslint-disable unicorn/prevent-abbreviations */
import {
  createApp,
  defineComponent,
  refCollection,
  refComponent,
  refComponents,
  refElement,
} from '@muban/muban';
import { html } from '@muban/template';
import type { TransitionRefCollection, TransitionRefElement } from '../types/transition.types';
import { transitionRefToElement } from './transition.utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
const SomeComponent = defineComponent({
  name: 'component',
});

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  () => html`
    <div data-component="app">
      <span data-ref="element"></span>
      <span data-ref="elements"></span>
      <span data-ref="elements"></span>
      <span data-component="component" data-ref="component"></span>
      <span data-component="component" data-ref="components"></span>
      <span data-component="component" data-ref="components"></span>
    </div>
  `,
);

// eslint-disable-next-line no-underscore-dangle
const { element, elements, component, components } = app._instance?.refs as never;

describe('TransitionRefElement', () => {
  test('Convert a refElement', () => {
    const result = transitionRefToElement(element as TransitionRefElement);
    expect(result?.tagName).toBe('SPAN');
  });

  test('Convert a refComponent', () => {
    const result = transitionRefToElement(component as TransitionRefElement);
    expect(result?.tagName).toBe('SPAN');
  });
});

describe('TransitionRefCollection', () => {
  test('Convert a refElements', () => {
    const results = transitionRefToElement(elements as TransitionRefCollection);
    expect(results.length).toBe(2);
  });

  test('Convert a refComponents', () => {
    const results = transitionRefToElement(components as TransitionRefCollection);
    expect(results.length).toBe(2);
  });
});
