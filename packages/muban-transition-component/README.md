# @mediamonks/muban-transition-component
Provides GreenSock transition functionality to [Muban](https://github.com/mubanjs/muban) components.

> :warning: This package is compatible with the latest version of [Muban](https://github.com/mubanjs/muban), please use 
> the original [muban-transition-component](https://github.com/riccoarntz/muban-transition-component) for [older versions of Muban](https://github.com/mediamonks/muban)  

### 🚀 Getting started
Install this package in your project:

```sh
yarn add @mediamonks/muban-transition-component
# or
npm i -S @mediamonks/muban-transition-component
```

Create a new transition context in your `App.ts` using one of the following hooks:
1. `useGlobalTransitionContext`
2. `usePageTransitioning`

#### `useGlobalTransitionContext`
This hook is the most basic version and all it does is creating a TransitionContext that can be used to reference other 
transition-components within your application.

#### `usePageTransitioning`
> Note: The `transitionOut` logic is still a todo!

This hook can be used to enable page transitions within Muban. 

### 💫 Using transitions 
You can now create transition components by using one of the following hooks in your component:
- `useTransitionController`
- `usePageTransition`
- `useScrollTransition`

#### `useTransitionController`
This hook can be used when you want to create a component that either requires a manual transition trigger or if it 
will be added to a parent timeline.

**Example usage**
```ts
...
setup({ refs }) {
  useTransitionController(refs.self, {
    registerTransitionController: true, // Whether or not you want to be able to access your controller from the transition-context
    refs: {
      // Any refs that will be forwarded to the `setupTransitionInTimelin` and `setupTransitionOutTimeline` functions
    },
    setupTransitionInTimeline: (timeline, elements, transitionContext) => {
      // Add your in timeline here.
    },
    setupTransitionOutTimeline: (timeline, elements, transitionContext) => {
      // Add your out timeline here. 
    },
    onStart: () => {
      // Triggered when a timeline starts.
    },
    onComplete: () => {
      // Triggered when a timeline is completed.
    },
  });
},
...
```

#### `usePageTransition`
This hook can be used when you want to create a page transition, it will automatically trigger the transitionIn when 
the component is mounted. 

It has the same configuration options as the `useTransitionController` does.

#### `useScrollTransition`
This hook can be used when you want to attach a timeline GreenSock's ScrollTrigger functionality.

It has the same configuration options as the `useTransitionController` does, with the addition of the `scrollTrigger` which has all the same options as [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger) has. 


## 📝 License
[MIT](../LICENSE)