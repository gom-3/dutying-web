import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

const defaultFiles = ['src/**/*.{ts,tsx,js,jsx}', 'cypress/**/*.{ts,tsx,js,jsx}', '*.{ts,mjs}'];
const defaultIgnores = ['coverage/**', 'dist/**', '**/*', '!src/**', '!cypress/**', '!*.{ts,mjs}'];

export function createReactAppConfig({
    files = defaultFiles,
    ignores = defaultIgnores,
    project,
    tsconfigRootDir,
    additionalRules = {},
} = {}) {
    if (!project || !tsconfigRootDir) {
        throw new Error('createReactAppConfig requires both "project" and "tsconfigRootDir".');
    }

    return [
        js.configs.recommended,
        {
            ignores,
        },
        {
            files,
            languageOptions: {
                parser: typescriptParser,
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    ecmaFeatures: {
                        jsx: true,
                    },
                    project,
                    tsconfigRootDir,
                },
                globals: {
                    ...globals.browser,
                    ...globals.node,
                    React: 'readonly',
                },
            },
            plugins: {
                '@stylistic': stylistic,
                '@typescript-eslint': typescript,
                import: importPlugin,
                prettier,
                react,
                'react-hooks': reactHooks,
                'react-refresh': reactRefresh,
            },
            rules: {
                ...typescript.configs.recommended.rules,
                ...react.configs.recommended.rules,
                ...reactHooks.configs.recommended.rules,
                ...prettierConfig.rules,
                '@typescript-eslint/no-require-imports': 'off',
                '@typescript-eslint/consistent-type-imports': ['error', {fixStyle: 'inline-type-imports'}],
                'no-redeclare': 'off',
                'no-import-assign': 'off',
                'no-constant-condition': 'warn',
                'import/no-cycle': ['error', {maxDepth: 3}],
                'import/no-named-as-default-member': 'off',
                'import/prefer-default-export': 'off',
                'import/no-unresolved': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/no-named-as-default': 'off',
                'import/order': [
                    'error',
                    {
                        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                        pathGroups: [
                            {
                                pattern: '@/**',
                                group: 'internal',
                                position: 'before',
                            },
                        ],
                        'newlines-between': 'never',
                        alphabetize: {order: 'asc', caseInsensitive: true},
                    },
                ],
                'react/jsx-filename-extension': [
                    1,
                    {
                        extensions: ['.jsx', '.tsx', '.js'],
                    },
                ],
                'react/react-in-jsx-scope': 'off',
                'react/jsx-key': 'error',
                'react/display-name': 'off',
                'react/prop-types': 'off',
                'prettier/prettier': [
                    'error',
                    {
                        endOfLine: 'auto',
                    },
                ],
                '@stylistic/no-multiple-empty-lines': ['error', {max: 2, maxEOF: 1}],
                '@stylistic/padding-line-between-statements': [
                    'error',
                    {blankLine: 'always', prev: 'const', next: '*'},
                    {blankLine: 'always', prev: '*', next: 'const'},
                    {blankLine: 'always', prev: ['let', 'var'], next: '*'},
                    {blankLine: 'always', prev: '*', next: ['let', 'var']},
                    {blankLine: 'always', prev: '*', next: 'if'},
                    {blankLine: 'always', prev: 'if', next: '*'},
                    {blankLine: 'always', prev: '*', next: 'return'},
                    {blankLine: 'always', prev: '*', next: 'function'},
                    {blankLine: 'always', prev: 'function', next: '*'},
                    {blankLine: 'always', prev: '*', next: ['for', 'while']},
                    {blankLine: 'always', prev: ['for', 'while'], next: '*'},
                    {blankLine: 'always', prev: '*', next: 'try'},
                    {blankLine: 'always', prev: 'try', next: '*'},
                    {blankLine: 'always', prev: '*', next: 'switch'},
                    {blankLine: 'always', prev: 'switch', next: '*'},
                    {blankLine: 'never', prev: 'const', next: 'const'},
                    {blankLine: 'never', prev: 'let', next: 'let'},
                    {blankLine: 'never', prev: 'var', next: 'var'},
                ],
                'prefer-const': 'error',
                'no-var': 'error',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_',
                        caughtErrorsIgnorePattern: '^_',
                    },
                ],
                '@typescript-eslint/prefer-optional-chain': 'error',
                '@typescript-eslint/prefer-nullish-coalescing': 'error',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'interface',
                        format: ['PascalCase'],
                        custom: {regex: '^I[A-Z]', match: true},
                    },
                    {
                        selector: 'typeAlias',
                        format: ['PascalCase'],
                        custom: {regex: '^T[A-Z]', match: true},
                    },
                ],
                ...additionalRules,
            },
            settings: {
                react: {
                    version: 'detect',
                },
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts', '.tsx'],
                },
                'import/resolver': {
                    typescript: true,
                    node: {
                        extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    },
                },
            },
        },
    ];
}
