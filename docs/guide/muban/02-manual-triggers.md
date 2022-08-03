# Triggering transitions manually

Transitions can be triggered through the transition controller that is returned by the
`useTransitionComponent` hook.

## Transition in

Transition in can be triggered by calling `transitionIn` on the transition controller

```ts {9-13,16}
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    // You can use the returned transition controller to manually trigger
    // `transitionIn` or `transitionOut`
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        timeline.from(elements.container, { autoAlpha: 0, duration: 1 });
      },
    });

    // Trigger the transition in once the component has been mounted
    onMounted(() => transitionController?.transitionIn());

    return [];
  },
});
```

## Transition out

This triggering this is very similar to triggering the transition out, so please refer to that
documentation.