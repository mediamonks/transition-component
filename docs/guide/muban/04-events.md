# Events

There are multiple ways to listen to the transition events.

- Hook callbacks
- Transition method callbacks
- Transition method promise

## Hook callbacks

```ts {15,18}
import { defineComponent } from '@muban/muban';
import { unwrapRefs, useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
   name: 'some-component',
   setup () {
      const transitionController = useTransitionController({
         refs: {
           container: refs.self
         },
         setupTransitionInTimeline: (timeline, refs) => {
            const { container } = unwrapRefs(refs);
            if (container) timeline.from(elements.container, { autoAlpha: 0, duration: 1 });
         },
         onStart: () => {
            // Triggered when a timeline starts, either `transitionIn` or `transitionOut`
         },
         onComplete: () => {
            // Triggered when a timeline is completed, either `transitionIn` or `transitionOut`
         },
      });

      return [];
   },
});
```

## Transition method callbacks

```ts {20,23}
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    const transitionController = useTransitionController({
      refs: {
        container: refs.self
      },
      setupTransitionInTimeline: (timeline, refs) => {
         const { container } = unwrapRefs(refs);
         if (container) timeline.from(elements.container, { autoAlpha: 0, duration: 1 });
      },
    });

    onMounted(() => {
      // This also works for `transitionOut`
      transitionController?.transitionIn({
        onStart: () => {
          // Triggered when a timeline starts!
        },
        onComplete: () => {
          // Triggered when a timeline is completed!
        },
      });
    });

    return [];
  },
});
```

## Transition method promises

```ts {19}
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    const transitionController = useTransitionController({
      refs: {
        container: refs.self
      },
      setupTransitionInTimeline: (timeline, refs) => {
         const { container } = unwrapRefs(refs);
         if (container) timeline.from(elements.container, { autoAlpha: 0, duration: 1 });
      },
    });

    onMounted(async () => {
      // This also works for `transitionOut`
      await transitionController?.transitionIn();
      // Triggered when a timeline is completed.
    });

    return [];
  },
});
```