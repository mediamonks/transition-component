import { bind, defineComponent, refComponent } from '@muban/muban';
import { Foo } from './components/foo/Foo';
import { useGlobalTransitionContext } from '@mediamonks/muban-transition-component';

export const App = defineComponent({
  name: 'app',
  refs: {
    transitionIn: 'transition-in',
    transitionOut: 'transition-out',
    events: 'events',
    foo: refComponent(Foo, {
      ref: 'foo',
    }),
  },
  setup({ refs }) {
    const transitionContext = useGlobalTransitionContext();

    return [
      bind(refs.transitionIn, {
        event: {
          click: () => transitionContext.getController(refs.foo)?.transitionIn(),
        },
      }),
      bind(refs.transitionOut, {
        event: {
          click: () => transitionContext.getController(refs.foo)?.transitionOut(),
        },
      }),
    ];
  },
});
