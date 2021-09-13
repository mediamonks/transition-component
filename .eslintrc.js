module.exports = {
  extends: ['@mediamonks/eslint-config-base'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['dist'],
  rules: {
    // Additions
    '@typescript-eslint/consistent-type-imports': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['strictCamelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'variable',
        // Exception for FunctionComponents
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        // Exception for FunctionComponents
        format: ['strictCamelCase', 'StrictPascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['StrictPascalCase'],
      },
    ],
  },
};
