module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:prettier/recommended',
        'eslint:recommended',
        'plugin:node/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'no-extra-semi': 'off',
        'node/no-unpublished-import': 'off',
    },
}
