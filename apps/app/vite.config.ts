import {fileURLToPath} from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

const renderChunks = (deps: Record<string, string>) => {
    const chunks: Record<string, string[]> = {};

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
    'react-loader-spinner': 'react-loader-spinner',
    'ts-pattern': 'ts-pattern',
    yup: 'yup',
    zustand: 'zustand',
};

const vendorPackages = ['react', 'react-router', 'react-router-dom', 'react-dom'];
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const defaultAppSiteUrl = 'https://app.dutying.net';
const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const dependencyChunks = renderChunks(dependencies);

const getManualChunk = (moduleId: string) => {
    const normalizedId = moduleId.replace(/\\/g, '/');

    if (!normalizedId.includes('/node_modules/')) {
        return undefined;
    }

    if (vendorPackages.some((packageName) => normalizedId.includes(`/node_modules/${packageName}/`))) {
        return 'vendor';
    }

    for (const [chunkName, packages] of Object.entries(dependencyChunks)) {
        if (packages.some((packageName) => normalizedId.includes(`/node_modules/${packageName}/`))) {
            return chunkName;
        }
    }

    return undefined;
};

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, workspaceRoot, '');
    const appSiteUrl = stripTrailingSlash(env.VITE_APP_PUBLIC_URL || env.VITE_APP_SITE_URL || defaultAppSiteUrl);

    return {
        envDir: workspaceRoot,
        build: {
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: getManualChunk,
                },
            },
        },
        plugins: [
            react(),
            babel({
                plugins: [
                    ['babel-plugin-react-compiler'],
                    [
                        '@locator/babel-jsx/dist',
                        {
                            env: 'development',
                        },
                    ],
                ],
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
