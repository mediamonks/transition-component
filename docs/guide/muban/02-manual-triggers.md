# Triggering transitions manually

Transitions can be triggered through the transition controller that is returned by the
`useTransitionComponent` hook.

## Transition in

Transition in can be triggered by calling `transitionIn` on the transition controller.

```ts {20}
import { defineComponent } from '@muban/muban';
import { unwrapRefs, useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup () {
    // You can use the returned transition controller to manually trigger
    // `transitionIn` or `transitionOut`
    const transitionController = useTransitionController({
      refs: {
        container: refs.self
      },
      setupTransitionInTimeline: (timeline, refs) => {
        const { container } = unwrapRefs(refs);
        if (container) timeline.from(container, { autoAlpha: 0, duration: 1 });
      },
    });

    // Trigger the transition in once the component has been mounted
    onMounted(() => transitionController?.transitionIn());

    return [];
  },
});
```

:::tip
Note that this is just an example and this example can also be achieved by using the [useEnterTransition](./01-hooks.md#useentertransition) hook
:::

## Transition out

Transition in can be triggered by calling `transitionOut` on the transition controller

```ts {26}
import { defineComponent } from '@muban/muban';
import { unwrapRefs, useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  refs: {
    someButton: 'some-button'
  },
  setup () {
    const transitionController = useTransitionController({
      refs: {
        container: refs.self
      },
      setupTransitionInTimeline: (timeline, { refs }) => {
        const { container } = unwrapRefs(refs);
        if (container) timeline.from(container, { autoAlpha: 0, duration: 1 });
      },
    });

    onMounted(() => transitionController?.transitionIn());

    return [
      bind(refs.someButton, {
        click () {
          // Manually trigger the transition out whenever you would want to.
          transitionController?.transitionOut()
        }
      })
    ];
  },
});
```