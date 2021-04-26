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
This can be easily achieved by adding it to your `App` component through the `useGlobalTransitionContext` hook.

```ts
import { defineComponent } from '@muban/muban';
import { useTransitionContext } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'app',
  setup() {
    useGlobalTransitionContext();   
    return [];
  }
});
```

### Page transition implementation
To enable page transitions you can use add the `usePageTransitions` hook to your `App` component
 
```ts
import { defineComponent } from '@muban/muban';
import { usePageTransitions } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'app',
  setup() {
    usePageTransitions();   
    return [];
  }
});
```

::: danger 
The `transitionOut` logic is still a todo! 
:::

## Component transitions
You can now create transition components by using one of the following hooks in your component:
- `useTransitionController`
- `usePageTransition`
- `useScrollTransition`

### `useTransitionController`
This hook can be used when you want to create a component that either requires a manual transition trigger or if it 
will be added to a parent timeline

```ts
import { defineComponent } from '@muban/muban';
import { useTransitionController } from '@mediamonks/muban-transition-component';
 
const MyComponent = defineComponent({
  name: 'some-component',
  setup() {
    useTransitionController(refs.self, {
      // Whether or not you want to be able to access your controller from 
      // the transition-context, defaults to `true`. If this is set to false you cannot nest 
      // this timeline inside another timeline.
      registerTransitionController: false, 
      refs: {
        // Any refs that will be forwarded to the `setupTransitionInTimelin` and 
        // `setupTransitionOutTimeline` functions
      },
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

**Nesting a timeline**
```ts
...
setupTransitionInTimeline: (timeline, { someRef }, transitionContext) => { 
  // Timelines can referenced through the `transitionContext`, use a ref or 
  // element to find the timeline on the context. 
  timeline.add(transitionContext.getTimeline(someRef));
},
...
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
You loose the transition events when you use the scroll transition hook.
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

## Using the Storybook addon

::: danger 
The Storybook addon is still todo!
:::