module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  rootDir: '../../',
  moduleNameMapper: {
    '@mediamonks/(.*)': ['<rootDir>/packages/$1/dist/cjs'],
  },
  roots: ['<rootDir>/packages/core-transition-component'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/core-transition-component/tsconfig.json',
    },
  },
};
