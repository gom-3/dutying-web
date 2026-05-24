import {fileURLToPath} from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

interface IChunks {
    [key: string]: string[];
}

const renderChunks = (deps: Record<string, string>) => {
    const chunks: IChunks = {};

    Object.keys(deps).forEach((key) => {
        if (['react', 'react-router-dom', 'react-dom'].includes(key)) {
            return;
        }

        chunks[key] = [key];
    });

    return chunks;
};
const dependencies = {
    '@hookform/resolvers': '@hookform/resolvers',
    '@tanstack/react-query': '@tanstack/react-query',
    '@tanstack/react-query-devtools': '@tanstack/react-query-devtools',
    axios: 'axios',
    exceljs: 'exceljs',
    history: 'history',
    immer: 'immer',
    'lodash-es': 'lodash-es',
    qs: 'qs',
    react: 'react',
    '@hello-pangea/dnd': '@hello-pangea/dnd',
    'react-cool-onclickoutside': 'react-cool-onclickoutside',
    'react-dom': 'react-dom',
    'react-draggable': 'react-draggable',
    'react-facebook-pixel': 'react-facebook-pixel',
    'react-ga4': 'react-ga4',
    'react-helmet': 'react-helmet',
    'react-hook-form': 'react-hook-form',
    'react-hot-toast': 'react-hot-toast',
    'ts-pattern': 'ts-pattern',
    yup: 'yup',
    zustand: 'zustand',
};
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const defaultAppSiteUrl = 'https://app.dutying.net';
const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, workspaceRoot, '');
    const appSiteUrl = stripTrailingSlash(env.VITE_APP_PUBLIC_URL || env.VITE_APP_SITE_URL || defaultAppSiteUrl);
    const isWindows = process.platform === 'win32';

    return {
        envDir: workspaceRoot,
        build: {
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-router-dom', 'react-dom', 'react-router', 'react-router-dom'],
                        ...renderChunks(dependencies),
                    },
                },
            },
        },
        plugins: [
            react({
                babel: {
                    plugins: [
                        ['babel-plugin-react-compiler'],
                        ...(!isWindows
                            ? [
                                  [
                                      '@locator/babel-jsx/dist',
                                      {
                                          env: 'development',
                                      },
                                  ] as const,
                              ]
                            : []),
                    ],
                },
            }),
            tsconfigPaths({projects: ['./tsconfig.app.json']}),
            tailwindcss(),
            mkcert(),
            {
                name: 'app-site-url-assets',
                transformIndexHtml(html) {
                    return html.split('__APP_SITE_URL__').join(appSiteUrl);
                },
                generateBundle() {
                    this.emitFile({
                        type: 'asset',
                        fileName: 'robots.txt',
                        source: `User-agent: *\nAllow: /\nSitemap: ${appSiteUrl}/sitemap.xml\n`,
                    });
                    this.emitFile({
                        type: 'asset',
                        fileName: 'sitemap.xml',
                        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${appSiteUrl}/</loc>\n  </url>\n</urlset>\n`,
                    });
                },
            },
        ],
        server: {
            host: 'local.app.dutying.net',
            port: 3000,
        },
        css: {
            devSourcemap: true,
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/vitest-setup.ts'],
            coverage: {
                reporter: ['text', 'json-summary', 'json'],
            },
        },
    };
});
