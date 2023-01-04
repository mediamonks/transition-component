import { themes } from '@storybook/theming';

const hasDarkModeEnabled =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: hasDarkModeEnabled ? themes.dark : themes.light,
  },
};
