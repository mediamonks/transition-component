module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  rootDir: '../../',
  moduleNameMapper: {
    '@mediamonks/(.*)': ['<rootDir>/packages/$1/dist/cjs'],
  },
  roots: ['<rootDir>/packages/muban-storybook-addon-transition'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/muban-storybook-addon-transition/tsconfig.json',
    },
  },
};
