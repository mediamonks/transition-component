import { defineComponent, refElement } from '@muban/muban';

import { useTransitionController } from '@mediamonks/muban-transition-component';
import { setupTransitionInTimeline } from './Bar.transitions';

export const Bar = defineComponent({
  name: 'bar',
  components: [],
  refs: {
    title: refElement<HTMLElement>('title'),
  },
  setup({ refs }) {
    useTransitionController({
      ref: refs.self,
      refs: {
        container: refs.self,
      },
      setupTransitionInTimeline,
    });

    return [];
  },
});
