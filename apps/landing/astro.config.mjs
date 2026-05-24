import {defineConfig} from 'astro/config';
import {loadRootEnv} from '../../packages/config/load-root-env.mjs';

const env = loadRootEnv(process.cwd());

export default defineConfig({
    site: env.PUBLIC_MARKETING_SITE_URL ?? 'https://dutying.net',
    build: {
        format: 'directory',
    },
    server: {
        host: 'local.dutying.net',
        port: 4321,
    },
    preview: {
        host: 'local.dutying.net',
        port: 4321,
    },
});
