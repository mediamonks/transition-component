import { useTransitionController } from '@mediamonks/muban-transition-component';
import { defineComponent, refComponent } from '@muban/muban';
import { Bar } from '../bar/Bar';
import { setupTransitionInTimeline, setupTransitionOutTimeline } from './Foo.transitions';

export const Foo = defineComponent({
  name: 'foo',
  refs: {
    bar: refComponent(Bar, { ref: 'bar', isRequired: true }),
  },
  setup({ refs }) {
    useTransitionController(refs.self, {
      setupTransitionInTimeline: setupTransitionInTimeline(refs),
      setupTransitionOutTimeline: setupTransitionOutTimeline(refs),
    });

    return [];
  },
});
