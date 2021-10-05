module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  rootDir: '../../',
  moduleNameMapper: {
    '@mediamonks/(.*)': ['<rootDir>/packages/$1/dist/cjs'],
    '^lodash-es$': 'lodash',
  },
  roots: ['<rootDir>/packages/muban-transition-component'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/muban-transition-component/tsconfig.json',
    },
  },
};
