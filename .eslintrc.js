module.exports = {
    extends: [
        '@mediamonks/eslint-config-base',
        // 'plugin:lit/recommended',
        // 'plugin:lit-a11y/recommended',
    ],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    ignorePatterns: [
        '**/webpack.config.js',
        '**/dist',
        // 'config',
        // 'src/polyfills.js',
        // 'scripts',
        // 'src/utils/transition/storybook-addon/register.js'
    ],
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
        // 'lit/no-legacy-template-syntax': 'off',
        // 'lit/no-private-properties': 'off',
        // 'lit/no-property-change-update': 'off',
        // 'lit/no-template-map': 'off',
        // 'lit/binding-positions': 'off',
        // 'lit/no-invalid-html': 'off',
    },
};
