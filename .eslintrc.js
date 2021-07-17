module.exports = {
    root: true,

    env: {
        node: true
    },

    parserOptions: {
        ecmaVersion: 2020
    },

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },

    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ]
}
