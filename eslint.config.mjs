import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        files: ['frontend/**/*.{js,mjs,cjs,jsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },
    {
        files: ['frontend/**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: globals.browser,
        },
    },
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    pluginReactHooks.configs['recommended-latest'],
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        rules: {
            'react/prop-types': 'off',
        },
    },
];
