# Resetting timelines

In some scenarios you might want to reset a timeline, for example you want to use a different
timeline on a certain breakpoint.

This can be easily achieved by calling the `resetTimeline` method and providing the desired
direction.

**Supported directions**

- `in`
- `out`

**Reset the in-transition**

```ts {19}
import { defineComponent } from '@muban/muban';
import { unwrapRefs, useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup () {
    const transitionController = useTransitionController({
      refs: {
        container: refs.self,
      },
      setupTransitionInTimeline: (timeline, refs) => {
        const { container } = unwrapRefs(refs);
        
        if (container) timeline.from(container, { autoAlpha: 0, duration: 1 });
      },
    });

    // Calling the reset method will re-initialize the timeline
    transitionController?.resetTimeline('in');

    return [];
  },
});
```