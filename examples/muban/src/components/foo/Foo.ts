import { defineComponent, onMounted, refComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
import { Bar } from '../bar/Bar';
import { setupTransitionInTimeline, setupTransitionOutTimeline } from './Foo.transitions';

export const Foo = defineComponent({
  name: 'foo',
  refs: {
    bar: refComponent(Bar, { ref: 'bar', isRequired: true }),
  },
  setup({ refs }) {
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline,
      setupTransitionOutTimeline,
      refs: {
        bar: refs.bar,
      },
    });

    onMounted(() => transitionController.transitionIn());

    return [];
  },
});
