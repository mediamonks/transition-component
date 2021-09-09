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
    useTransitionController(refs.self, {
      setupTransitionInTimeline: setupTransitionInTimeline(refs),
    });

    return [];
  },
});
