import { defineComponent, refComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
import { Bar } from '../bar/Bar';
import { setupTransitionInTimeline, setupTransitionOutTimeline } from './Foo.transitions';

export const Foo = defineComponent({
  name: 'foo',
  refs: {
    bar: refComponent(Bar, { ref: 'bar', isRequired: true }),
  },
  setup({ refs }) {
    useTransitionController({
      ref: refs.self.element,
      refs: {
        container: refs.self,
        bar: refs.bar,
      },
      setupTransitionInTimeline,
      setupTransitionOutTimeline,
    });

    return [];
  },
});
