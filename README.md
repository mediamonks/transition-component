# @mediamonks/transition-component

Monorepo that contains everything related to animations!

## 📦 Packages

| Package                                        | Status                                                                                     | Description                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [@mediamonks/core-transition-component]        | [![core-transition-component-status]][@mediamonks/core-transition-component]               | The core package that holds the transition logic.           |
| [@mediamonks/muban-transition-component]       | [![muban-transition-component-status]][@mediamonks/muban-transition-component]             | The Muban implementation of the transition-component logic. |
| [@mediamonks/muban-storybook-addon-transition] | [![muban-storybook-addon-transition-status]][@mediamonks/muban-storybook-addon-transition] | A Muban-storybook addon to control your timelines.          |
| [@mediamonks/react-animation]                  | [![react-animation-status]][@mediamonks/react-animation]                                   | Hooks to control GSAP animations                            |
| [@mediamonks/react-transition-presence]        | [![react-transition-presence-status]][@mediamonks/react-transition-presence]               | Before unmount lifecycle                                    |

## 🎓 Documentation

Have a look at the [documentation](https://mediamonks.github.io/transition-component/)

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
