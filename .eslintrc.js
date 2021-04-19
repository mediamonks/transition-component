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
        'public'
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
    },
};
