import { defineComponent } from '@muban/muban';
import { useGlobalTransitionContext } from '../hooks/useGlobalTransitionContext';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = defineComponent({
  name: 'app',
  setup() {
    useGlobalTransitionContext();

    return [];
  },
});
