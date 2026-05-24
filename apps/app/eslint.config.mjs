import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createReactAppConfig} from '@dutying/config/eslint/react-app';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default [
    ...createReactAppConfig({
        project: './tsconfig.app.json',
        tsconfigRootDir: currentDir,
        additionalRules: {
            'import/no-restricted-paths': [
                'warn',
                {
                    zones: [
                        {
                            target: ['./src/pages'],
                            from: ['./src/app'],
                            message: 'pages는 app을 import할 수 없습니다.',
                        },
                        {
                            target: ['./src/widgets'],
                            from: ['./src/pages', './src/app'],
                            message: 'widgets는 pages/app을 import할 수 없습니다.',
                        },
                        {
                            target: ['./src/features'],
                            from: ['./src/widgets', './src/pages', './src/app'],
                            message: 'features는 widgets/pages/app을 import할 수 없습니다.',
                        },
                        {
                            target: ['./src/entities'],
                            from: ['./src/features', './src/widgets', './src/pages', './src/app'],
                            message: 'entities는 상위 레이어를 import할 수 없습니다.',
                        },
                        {
                            target: ['./src/shared'],
                            from: ['./src/entities', './src/features', './src/widgets', './src/pages', './src/app'],
                            message: 'shared는 상위 레이어를 import할 수 없습니다.',
                        },
                    ],
                },
            ],
        },
    }),
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: currentDir,
            },
        },
    },
    {
        ignores: ['eslint.config.mjs'],
    },
];
