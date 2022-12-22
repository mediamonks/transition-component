import { StorybookConfig } from '@storybook/types';

const path = require('path');

// .storybook/main.js
const config: StorybookConfig = {
  stories: [],
  refs(config, { configType }) {
    return {
      '@mediamonks/muban-transition-component': {
        title: '@mediamonks/muban-transition-component',
        url: 'http://localhost:7000',
      },
      '@mediamonks/react-animation': {
        title: '@mediamonks/react-animation',
        url: 'http://localhost:8000',
      },
      '@mediamonks/react-transition-presence': {
        title: '@mediamonks/react-transition-presence',
        url: 'http://localhost:8001',
      },
    };
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    docsPage: true,
  },
};

export default config;
