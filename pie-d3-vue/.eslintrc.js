module.exports = {
    root: true,
    env: {
        node: true,
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        // allow paren-less arrow functions
        'arrow-parens': 'off',
        'one-var': 'off',
        'indent': 'off', // disable indent check
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'space-before-function-paren': 'off',
        'object-property-newline': 'off',
        'curly': 'off', //['error', 'multi', 'consistent'],
        // allow debugger during development
        'spaced-comment': 'off',
        'brace-style': ['error', 'stroustrup', {'allowSingleLine': true}],
        'no-multi-spaces': ['warn', {ignoreEOLComments: true}],
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
