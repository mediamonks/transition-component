# @mediamonks/transition-component

Monorepo that contains everything related to the transition-component!

## 📦 Packages

| Package                            | Status                                                                         | Description                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [core-transition-component]        | [![core-transition-component-status]][core-transition-component]               | The core package that holds the transition logic.           |
| [muban-transition-component]       | [![muban-transition-component-status]][muban-transition-component]             | The Muban implementation of the transition-component logic. |
| [muban-storybook-addon-transition] | [![muban-storybook-addon-transition-status]][muban-storybook-addon-transition] | A Muban-storybook addon to control your timelines.          |

## 🎓 Documentation

Have a look at the [documentation](https://mediamonks.github.io/transition-component/) for the
getting started guides.

## 🎩 Examples

- [Muban example](./examples/muban) - An example implementation of the `muban-transition-component`
  package in Muban.

> **Starting the examples**
>
> The examples are dependent on the packages in this repository, so to get them to work you'll have
> to do the following:
>
> 1. Checkout the entire Git repository (not just the example folder).
> 2. Run `yarn` in the root of the Git repository to install all dependencies.
> 3. Change directory to the desired example folder, for example `cd examples/muban`.
> 4. Start up the development server by running `yarn dev`.

## 💪 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would
like to change. Please make sure to update tests accordingly.

Installation requires a greensock license, create a .npmrc file in the root of the repository with
the necessary configuration to install the business package.

```
.npmrc

//npm.greensock.com/:_authToken=<your-auth-token>
@gsap:registry=https://npm.greensock.com

```

## 📝 License

[MIT](./LICENSE)

[core-transition-component]: ./packages/core-transition-component
[core-transition-component-status]:
  https://img.shields.io/npm/v/@mediamonks/core-transition-component.svg?colorB=41a6ff
[muban-transition-component]: ./packages/muban-transition-component
[muban-transition-component-status]:
  https://img.shields.io/npm/v/@mediamonks/muban-transition-component.svg?colorB=41a6ff
[muban-storybook-addon-transition]: ./packages/muban-storybook-addon-transition
[muban-storybook-addon-transition-status]:
  https://img.shields.io/npm/v/@mediamonks/muban-storybook-addon-transition.svg?colorB=41a6ff
