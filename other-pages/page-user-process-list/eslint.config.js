import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...svelte.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['step_definitions/**', 'cypress/**'],
        languageOptions: {
            globals: {
                cy: 'readonly',
                Cypress: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
            },
        },
    },
    {
        ignores: ['build/', 'build-gradle/', 'node_modules/', '.svelte-kit/', 'coverage/'],
    },
];
