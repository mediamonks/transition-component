# Hooks

You can now create transition components by using one of the following hooks:

- `useTransitionController`
- `useEnterTransition`
- `useScrollTransition`

## `useTransitionController`

This hook can be used when you want to create a component that either requires a manual transition
trigger or if it will be added to a parent timeline.

```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup({ refs }) {
    const controller = useTransitionController({ 
      // The ref is used to reference the transition-controller, the transition-controller will not be registered if 
      // this value is not provided. Usually you would provide the `self` ref but you could technically provide any 
      // ref you want.
      ref: refs.self,
      // Any refs that will be forwarded to the `setupTransitionInTimeline` and
      // `setupTransitionOutTimeline` functions
      refs: {
        // You can proivde the refs in a `key`: `value` notation.
      },
      // `timeline` - This is the GreenSock timeline where the animations will be added.
      // `refs` - This is an object that holds all of the refs, you can unwrap them with the `unwrapRefs` util.
      setupTransitionInTimeline: (timeline, refs) => {
        // Add your in timeline here.
      },
      setupTransitionOutTimeline: (timeline, refs) => {
        // Add your out timeline here.
      },
    });
    
    onMounted(() => {
      // Trigger the `transitionIn` whenever you would want to
      controller?.transitionIn();
    })

    return [];
  },
});
```

Take a look at this working example on CodePen

<iframe src="https://codesandbox.io/embed/controlling-the-transition-controller-tbv4g?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Controlling the transition-controller" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>

### Nesting a timeline

Nesting timelines can be achieved through the `findTransitionController` util, you can use a ref to find the transition-controller associated with it.

:::tip 
Make sure the target component has the `ref` value set to ensure it's registered. 
:::

```ts
import { findTransitionController } from '@mediamonks/muban-transition-component';

...
setupTransitionInTimeline: (timeline, { someRef }, transitionContext) => {
    // Timelines can referenced through the `transitionContext`, use a `ref` to find the controller
   const someTimeline = findTransitionController(someRef)?.getTimeline('in')
   // Make sure to check if the timeline exists before adding it.
   if(someTimeline) timeline.add(someTimeline);
},
...
```

Take a look at this working example on CodePen

<iframe src="https://codesandbox.io/embed/nesting-a-timeline-within-another-timeline-bt78t?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Nesting a timeline within another timeline" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### Separating your transition logic

When your timelines becomes more complex and grows in size you might want to consider moving your
setup functions to a separate file (for example: `myComponent.transitions.ts`).

```ts
// SomeComponent.ts
import { defineComponent, refElement, refElements } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
import { setupTransitionInTimeline } from './SomeComponent.transitions.ts';

const MyComponent = defineComponent({
  name: 'some-component',
  refs: {
    someRefElement: refElement<HTMLDivElement>('some-ref-element'),
    someRefCollection: refElements<HTMLDivElement>('some-ref-collection'),
  },
  setup({ refs }) {
    useTransitionController({
      ref: refs.self,
      // Here we provide the refs that we want to use in your transition.
      refs: {
        someRefElement: refs.someRefElement,
        someRefCollection: refs.someRefCollection,
      },
      // Note that we now pass a function that does the setup instead of doing it inline.
      setupTransitionInTimeline,
    });

    return [];
  },
});
```

```ts
// SomeComponent.transitions..ts
import type { CollectionRef, ElementRef } from '@muban/muban';
import { unwrapRefs } from '@mediamonks/muban-transition-component';

// Define the type of refs you are providing, this way we can automatically type the elements returned
type TransitionRefs = {
  someRefElement: ElementRef<HTMLDivElement>;
  someRefCollection: CollectionRef<HTMLDivElement>;
};

export const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline,
  refs,
  transitionContext,
) => {
  const { someRefElement, someRefCollection } = unwrapRefs(refs);
  // `someRefElement` is automatically converted to an `HTMLElement | undefined`.
  // `someRefCollection` is automatically converted to an `Array<HTMLElement>`.
  // Add whatever transition you would want here
};
```

### Defining your TransitionRefs

As you might have noticed we type the `Refs` that are added to the hook configuration, it's
important to do this to ensure we get the correct typings in your setup function. 


These types can be grouped into the following two categories:

- Single refs
- Collection refs

#### Single refs

This group holds all `refs` that are retrieved through one of the following ref definitions in
Muban:

- [refElement](https://mubanjs.github.io/muban/api/refs.html#refelement)
- [refComponent](https://mubanjs.github.io/muban/api/refs.html#refcomponent)

#### Collection refs

This group holds all `refs` that are retrieved through one of the following ref definitions in
Muban:

- [refCollection](https://mubanjs.github.io/muban/api/refs.html#refcollection)
- [refComponents](https://mubanjs.github.io/muban/api/refs.html#refcomponents)

### Multiple timelines

In some cases you might want to create multiple timelines per component. This could be done by
proxying your `setupTransitionInTimeline` method and resetting the timeline when needed.

> **Note:** There are probably multiple ways of doing this, so please refer to this as just an
> example!

```ts
// SomeComponent.ts
...
import { watch } from '@muban/muban';
import { getTimeline } from './SomeComponent.transitions.ts';
...

...
 setup({ refs }) {
    const transitionController = useTransitionController({
      ref: refs.self,
      setupTransitionInTimeline: (timeline, refs) =>
        // The `getTimeline` method is used to find the correct timeline.
        getTimeline(props).in(timeline, elements),
    });

    // In this example we watch some ref that might change due to a
    // window resize or what ever you can think of.
    watch(someRef, () => {
      transitionController?.resetTimeline('in');
    });

    return [];
  },
...
```

```ts
// SomeComponent.transitions.ts
import {
  TransitionDirection,
  SetupTransitionSignature,
} from '@mediamonks/muban-transition-component';

type SetupTimeline = Record<TransitionDirection, SetupTransitionSignature>;

export const setupTimeline: Record<'default' | 'other', SetupTimeline> = {
  default: {
    in: (timeline, refs) => {
      // Some in animation.
    },
    out: (timeline, refs) => {
      // Some out animation.
    },
  },
  other: {
    in: (timeline, refs) => {
      // Some other in animation.
    },
    out: (timeline, refs) => {
      // Some other out animation.
    },
  },
};

// This method will be called when the setup method is called, so make sure
// to return the correct timeline for the correct condition.
export const getTimeline = (props: SomeComponentProps) => {
  // Define what condition returns what timeline.
  if (props.somePropValue === 'other') return setupTimeline.other;

  return setupTimeline.default;
};
```

## `useEnterTransition`

This hook can be used when you want to create a transition that is started as soon as it's mounted, it will automatically 
trigger the `transitionIn` when the `onMounted` hook is fired.

```ts {2,7-10}
import { defineComponent } from '@muban/muban';
import { usePageTransition } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    useEnterTransition({
      ref: refs.self
      // Add your transition configuration.
      // It supports the same as the `useTransitionController` hook.
    });

    return [];
  },
});
```

## `useScrollTransition`

This hook can be used when you want to attach a timeline GreenSock's ScrollTrigger functionality. It
basically has the same configuration options as the `useTransitionController` does with two major
differences:

1. The addition of the `scrollTrigger` key, which has all the same options as
   [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger).
2. The default value for the `registerTransitionController` is set to `false`.

```ts {2,7-10}
import { defineComponent } from '@muban/muban';
import { useScrollTransition } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    useScrollTransition({
      ref: refs.self
      // Add your transition configuration.
      // It supports the same as the `useTransitionController` hook.
    });

    return [];
  },
});
```

::: warning 
When using this hook there will be no Promise returned by the `transitionIn` /
`transitionOut` methods, you can still use the regular event callbacks in the setupOptions though.
:::

Take a look at this working example on CodePen

<iframe src="https://codesandbox.io/embed/using-scrolltrigger-to-trigger-transitions-qewqv?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Using ScrollTrigger to trigger transitions" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### Global variables

In some scenarios you might want to set some ScrollTrigger variables for all components that are
children of a certain component.

An example scenario might be a lightbox like component with it's own scrollbar that is displayed on
top of your main application. In this scenario you will need to define a
[scroller](https://greensock.com/docs/v3/Plugins/ScrollTrigger/scroller) to ensure that `gsap` uses
the correct scrollbar for triggering the transitions.

```ts {2,7,11,13-16}
import { defineComponent, refElement } from '@muban/muban';
import { provideScrollContext, ScrollContext } from '@mediamonks/muban-transition-component';

const SomeParentComponent = defineComponent({
  name: 'some-parent-component',
  refs: {
    content: refElement('content'),
  },
  setup({ refs }) {
    // Provide the context to set the global properties.
    provideScrollContext(
      // You can set all of the properties that are supported by the ScrollTrigger plugin.
      new ScrollContext({
        scroller: refs.content.element,
      }),
    );

    return [];
  },
});
```

:::tip 
The child still has the final say on what will be executed. So if you provide the same
properties to the configuration of your child's `useScrollTransition` hook, they will overwrite the
global ones. 
:::

### Looping timelines

Looping timelines can be easily achieved through using the `useScrollTransition` hook and setting the timeline `repeat`
count to `-1`. This will make sure the timeline will repeat forever until it scrolls out of the viewport

```ts {13}
import { defineComponent } from '@muban/muban';
import { unwrapRefs, useTransitionController } from '@mediamonks/muban-transition-component';

const MyComponent = defineComponent({
   name: 'some-component',
   setup () {
      // You can use the returned transition controller to manually trigger
      // `transitionIn` or `transitionOut`
      const transitionController = useTransitionController(refs.self, {
         setupTransitionInTimeline: (timeline, refs) => {
            const { container } = unwrapRefs(refs);
            
            timeline.loop(-1)

            if(container) timeline
              .from(elements.container, { autoAlpha: 0, duration: 1 })
              .to(elements.container, { autoAlpha: 0, duration: 1 });
         },
      });

      // Trigger the transition in once the component has been mounted
      onMounted(() => transitionController?.transitionIn());

      return [];
   },
});
```

Take a look at this working example on CodePen

<iframe src="https://codesandbox.io/embed/creating-a-looping-timeline-crf7zb?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Creating a looping timeline" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>

::: tip
Make sure that the timeline can be seamlessly looped.
:::


### 