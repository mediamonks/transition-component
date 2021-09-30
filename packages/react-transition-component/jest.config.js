module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  rootDir: '../../',
  moduleNameMapper: {
    '@mediamonks/(.*)': ['<rootDir>/packages/$1/dist/cjs'],
  },
  roots: ['<rootDir>/packages/react-transition-component'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/react-transition-component/tsconfig.json',
    },
  },
};
