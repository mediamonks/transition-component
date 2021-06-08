# Getting started

## Installing
::: warning 
This module only works for **[Muban 2.x](https://github.com/mubanjs/muban)**
:::

Add `muban-transition-component` to your project:

<code-group>
<code-block title="YARN">
```sh
yarn add @mediamonks/muban-transition-component
```
</code-block>

<code-block title="NPM">
```sh
npm i -S @mediamonks/muban-transition-component
```
</code-block>
</code-group>

## Add to your project
Before you can start using the GreenSock transitions in your project you will first need to provide a `TransitionContext` for all child components.

### Basic implementation
This can be achieved by adding it to your `App` component through the `useGlobalTransitionContext` hook.

```ts
import { defineComponent } from '@muban/muban';
import { useGlobalTransitionContext } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'app',
  setup() {
    useGlobalTransitionContext();   
    return [];
  }
});
```

### Storybook implementation
Since Muban Storybook doesn't use the `App` you will have to also make sure the `TransitionContext` is available 
there. Storybook has support for decorators that can be wrapped around your stories and this is exactly what we are 
going to do. 

Update the `.storybook/preview.js` file to include the following decorator logic:
```ts
...
import { useGlobalTransitionContext } from '@mediamonks/muban-transition-component';
import { defineComponent } from '@muban/muban';
import { createDecoratorComponent } from '@muban/storybook';

...
export const decorators = [
  createDecoratorComponent(({ component }) => {
    return {
      component: defineComponent({
        name: 'global-context',
        components: [component],
        setup() {
          useGlobalTransitionContext();
          return [];
        },
      }),
    }
  }),
]
```  

### Page transition implementation
To enable page transitions you can use add the `usePageTransitions` hook to your `App` component. 
 
```ts
import { defineComponent } from '@muban/muban';
import { usePageTransitioning } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'app',
  setup() {
    usePageTransitioning();   
    return [];
  }
});
```

> This hook is an extension on the `useGlobalTransitionContext` hook described in the previous section.

::: danger 
The automated `transitionOut` logic is still a todo! 
:::

## Component transitions
You can now create transition components by using one of the following hooks:
- `useTransitionController`
- `usePageTransition`
- `useScrollTransition`

### `useTransitionController`
This hook can be used when you want to create a component that either requires a manual transition trigger or if it 
will be added to a parent timeline.

```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup({ refs }) {
    // The first argument is the ref that is used to reference the transition-controller. Usually you would provide the 
    // `self` ref but you could technically provide any ref you want.
    useTransitionController(refs.self, {
      // Whether or not you want to be able to access your controller from 
      // the transition-context, defaults to `true`. If this is set to false you cannot nest 
      // this timeline inside another timeline.
      registerTransitionController: false, 
      refs: {
        // Any refs that will be forwarded to the `setupTransitionInTimeline` and 
        // `setupTransitionOutTimeline` functions
      },
      // `timeline` - This is the GreenSock timeline where the animations will be added.
      // `elements` - This is an object that holds all of the unwrapped refs (`HTMLElement|Array<HTMLElement>`) that are provided in the refs object.
      // `transitionContext` - This context can be used to reference other timelines and nest them in your timeline.    
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        // Add your in timeline here.
      },
      setupTransitionOutTimeline: (timeline, elements, transitionContext) => {
        // Add your out timeline here. 
      },   
    });   
      
    return [];
  }
});
```

#### Nesting a timeline
Nesting timelines can be achieved through the `transitionContext`. 

You simply call the `getTimeline` method with a ref that references the HTMLElement that was used to create the transitionController.
 
```ts
...
setupTransitionInTimeline: (timeline, { someRef }, transitionContext) => { 
  // Timelines can referenced through the `transitionContext`, use a `ref` or 
  // `HTMLElement` to find the timeline on the context. 
  timeline.add(transitionContext.getTimeline(someRef));
},
...
```

#### Separating your transition logic

When your timelines becomes more complex and grows in size you might want to consider moving your setup functions to a separate file (for example: `myComponent.transitions.ts`).

```ts
// SomeComponent.ts
import { defineComponent, refElement, refElements } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
import { setupTransitionInTimeline } from './SomeComponent.transitions.ts';
 
const MyComponent = defineComponent({
  name: 'some-component',
  refs: {
    someRefElement: refElement('some-ref-element'),
    someRefCollection: refElements('some-ref-collection'),
  },
  setup({ refs }) {
    useTransitionController(refs.self, {
      // Here we provide the refs that we want to use in your transition.
      refs: {
        someRefElement: refs.someRefElement,
        someRefCollection: refs.someRefCollection
      },
      // Note that we now pass a function that does the setup instead of doing it inline.
      setupTransitionInTimeline,
    });   
      
    return [];
  }
});
```

```ts
// SomeComponent.transitions..ts
import type {
  SetupTransitionSignature,
  TransitionRefElement,
  TransitionRefCollection,
} from '@mediamonks/muban-transition-component';

// Define the type of refs you are providing, this way we can automatically type the elements returned
type TransitionRefs = {
  someRefElement: TransitionRefElement,
  someRefCollection: TransitionRefCollection,
};

export const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline, { someRefElement, someRefCollection }, transitionContext
) => {
  // `someRefElement` is automatically converted to an `HTMLElement | undefined`.
  // `someRefCollection` is automatically converted to an `Array<HTMLElement>`.
  
  // Add whatever transition you would want here
};
```
   

#### Defining your TransitionRefs
As you might have noticed we type the `Refs` that are added to the hook configuration, it's important to do this to ensure we get the correct typings in your setup function. 

These types can be grouped into the following two categories:
 - `TransitionRefElement`
 - `TransitionRefCollection` 

##### TransitionRefElement
This group holds all `refs` that are retrieved through one of the following ref definitions in Muban:
 - [refElement](https://mubanjs.github.io/muban/api/refs.html#refelement)
 - [refComponent](https://mubanjs.github.io/muban/api/refs.html#refcomponent)

##### TransitionRefCollection
This group holds all `refs` that are retrieved through one of the following ref definitions in Muban:
 - [refCollection](https://mubanjs.github.io/muban/api/refs.html#refcollection)
 - [refComponents](https://mubanjs.github.io/muban/api/refs.html#refcomponents)

#### Multiple timelines
In some cases you might want to create multiple timelines per component. This could be done 
by proxying your `setupTransitionInTimeline` method and resetting the timeline when needed. 

> **Note:** There are probably multiple ways of doing this, so please refer to this as just an example!

```ts
// SomeComponent.ts
...
import { watch } from '@muban/muban';
import { getTimeline } from './SomeComponent.transitions.ts';
...

...
 setup({ refs }) {
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => 
        // The `getTimeline` method is used to find the correct timeline. 
        getTimeline(props).in(timeline, elements, transitionContext),        
    });
    
    // In this example we watch some ref that might change due to a 
    // window resize or what ever you can think of.
    watch(someRef, () => {
      transitionController.setupTimeline({ direction: 'in', reset: true })
    });
      
    return [];
  },
...
```

```ts
// SomeComponent.transitions.ts
import { 
  TransitionDirection, 
  SetupTransitionSignature 
} from '@mediamonks/muban-transition-component';

type SetupTimeline = Record<TransitionDirection, SetupTransitionSignature>;

export const setupTimeline: Record<'default' | 'other', SetupTimeline> = {
  default: {
    in: (timeline, elements, transitionContext) => {
        // Some in animation.      
    },
    out: (timeline, elements, transitionContext) => {
        // Some out animation.      
    }
  },
  other: {
    in: (timeline, elements, transitionContext) => {
        // Some other in animation.      
    },
    out: (timeline, elements, transitionContext) => {
        // Some other out animation.      
    }
  }
}

// This method will be called when the setup method is called, so make sure 
// to return the correct timeline for the correct condition.
export const getTimeline = (props:SomeComponentProps) => {  
  // Define what condition returns what timeline. 
  if(props.somePropValue === 'other') return setupTimeline.other;

  return setupTimeline.default
} 
```


### `usePageTransition`
This hook can be used when you want to create a page transition, it will automatically trigger the `transitionIn` when 
the component has been mounted. 

```ts
import { defineComponent } from '@muban/muban';
import { usePageTransition } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-page-component',
  setup() {
    usePageTransition(refs.self, {
      // Add your transition configuration. 
      // It supports the same as the `useTransitionController` hook.
    });   
      
    return [];
  }
});
```

### `useScrollTransition`
This hook can be used when you want to attach a timeline GreenSock's ScrollTrigger functionality.

It has the same configuration options as the `useTransitionController` does, with the addition of the `scrollTrigger` which has all the same options as [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger) has.

```ts
import { defineComponent } from '@muban/muban';
import { useScrollTransition } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-page-component',
  setup() {
    useScrollTransition(refs.self, {
      // Add your transition configuration. 
      // It supports the same as the `useTransitionController` hook.
    });   
      
    return [];
  }
});
```

::: warning 
You lose the transition events when you use the scroll transition hook.
:::


#### Global ScrollTrigger variables
In some scenarios you might want to set some ScrollTrigger variables for all components that are children of a certain component. 

An example scenario might be a lightbox like component with it's own scrollbar that is displayed on top of your main application. In this scenario you will need to define a [scroller](https://greensock.com/docs/v3/Plugins/ScrollTrigger/scroller) to ensure that `gsap` uses the correct scrollbar for triggering the transitions.

```ts
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
  }
});
```

:::tip
The child still has the final say on what will be executed. So if you provide the same properties to the configuration of your child's `useScrollTransition` hook, they will overwrite the global ones.
:::

### Triggering transitions
Transitions can be triggered through the transition controller that is returned by the `useTransitionComponent` hook. 

#### Transition in timeline
Transition in can be triggered by calling `transitionIn` on the transition controller

```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    // You can use the returned transition controller to manually trigger 
    // `transitionIn` or `transitionOut`
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        timeline.from(elements.container, { autoAlpha: 0, duration: 1})
      },
    });
  
    // Trigger the transition in once the component has been mounted
    onMounted(() => transitionController.transitionIn())
   
    return [];
  }
});
``` 

#### Transition out timeline
This triggering this is very similar to triggering the transition out, so please refer to that documentation.

#### Looping timelines

::: danger 
Looping timelines are still a todo! 
:::

### Events
There are multiple ways to listen to the transition events.
- Hook callbacks
- Transition method callbacks
- Transition method promise

#### Hook callbacks
```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        timeline.from(elements.container, { autoAlpha: 0, duration: 1})
      },
      onStart: () => {
        // Triggered when a timeline starts, either `transitionIn` or `transitionOut`
      },
      onComplete: () => {
        // Triggered when a timeline is completed, either `transitionIn` or `transitionOut`
      },
    });
  
    return [];
  }
});
```

#### Transition method callbacks
```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        timeline.from(elements.container, { autoAlpha: 0, duration: 1})
      },     
    });
  
    onMounted(() => {
      // This also works for `transitionOut`
      transitionController.transitionIn({
        onStart: () => {
          // Triggered when a timeline starts!
        },
        onComplete: () => {
          // Triggered when a timeline is completed!
        },
      })    
    });
  
    return [];
  }
});
```

#### Transition method promises
```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    const transitionController = useTransitionController(refs.self, {
      setupTransitionInTimeline: (timeline, elements, transitionContext) => {
        timeline.from(elements.container, { autoAlpha: 0, duration: 1})
      },     
    });
  
    onMounted(async () => {
      // This also works for `transitionOut`
      await transitionController.transitionIn()
       // Triggered when a timeline is completed.
    });
  
    return [];
  }
});
```

## Muban Storybook
You might not want to trigger transitions when you open up a component in Storybook, but you might still 
want to be able to preview/test them.

This can be done by installing `muban-storybook-addon-transition` in your project.
 
 <code-group>
 <code-block title="YARN">
 ```sh
 yarn add @mediamonks/muban-storybook-addon-transition
 ```
 </code-block>
 
 <code-block title="NPM">
 ```sh
 npm i -S @mediamonks/muban-storybook-addon-transition
 ```
 </code-block>
 </code-group>

After installing the package you can add it to the `main.ts` file in the `.storybook` directory.

```ts
module.exports = {
  stories: [],
  addons: [
    "@mediamonks/muban-storybook-addon-transition",
  ],
};
```

To make sure the addon can find the timelines you'll have to expose the `TransitionContext` on the `Window`. This can 
be done by updating the `.storybook/preview.js` file and make sure we store the return value.
 
 ```ts
...
window.parent.window.transitionContext = useGlobalTransitionContext();
...
```

After adding the addon you will now have a "Transitions" tab in Storybook that can be used to control the 
timeline for the current active component.

![Screenshot of the Storybook addons](../../images/muban-storybook-addon-transition-screenshot.png)

If the current component does not have a registered timeline it will show the following message:

![Screenshot of the Storybook addons without a timeline](../../images/muban-storybook-addon-transition-screenshot-no-timeline.png)
