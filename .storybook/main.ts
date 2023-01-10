import { StorybookConfig } from '@storybook/types';

export default {
  stories: [],
  refs: {
    '@mediamonks/muban-transition-component': {
      title: '@mediamonks/muban-transition-component',
      url: 'https://mediamonks.github.io/transition-component/muban-transition-component',
    },
    '@mediamonks/react-animation': {
      title: '@mediamonks/react-animation',
      url: 'https://mediamonks.github.io/transition-component/react-animation',
    },
    '@mediamonks/@react-transition-presence': {
      title: '@mediamonks/@react-transition-presence',
      url: 'https://mediamonks.github.io/transition-component/react-transition-presence',
    },
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
} satisfies StorybookConfig;
