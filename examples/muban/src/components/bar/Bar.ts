import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
import { setupTransitionInTimeline } from './Bar.transitions';

export const Bar = defineComponent({
  name: 'bar',
  components: [],
  refs: {
    title: 'title',
  },
  setup({ refs }) {
    useTransitionController({
      ref: refs.self.element,
      refs: {
        container: refs.self,
        title: refs.title,
      },
      setupTransitionInTimeline,
    });

    return [];
  },
});
