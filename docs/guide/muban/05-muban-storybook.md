# Muban Storybook

You might not want to trigger transitions when you open up a component in Storybook, but you might
still want to be able to preview/test them.

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
  addons: ['@mediamonks/05-muban-storybook.md-addon-transition'],
};
```

To make sure the addon can find the timelines you'll have to expose the `findTransitionController` on the
`Window`. This can be done by updating the `.storybook/preview.js` file and make sure we store the
return value.

```ts
...
window.parent.window.findTransitionController = findTransitionController;
...
```

After adding the addon you will now have a "Transitions" tab in Storybook that can be used to
control the timeline for the current active component.

![Screenshot of the Storybook addons](../../images/muban-storybook-addon-transition-screenshot.png)

If the current component does not have a registered timeline it will show the following message:

![Screenshot of the Storybook addons without a timeline](../../images/muban-storybook-addon-transition-screenshot-no-timeline.png)
