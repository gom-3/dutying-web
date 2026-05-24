import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const DEFAULT_MARKETING_SITE_URL = 'https://dutying.net';
const DEFAULT_APP_SITE_URL = 'https://app.dutying.net';
const DEFAULT_DOCS_SITE_URL = 'https://docs.dutying.net';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url));

const parseEnvFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return fs
        .readFileSync(filePath, 'utf8')
        .split(/\r?\n/)
        .reduce<Record<string, string>>((acc, line) => {
            const trimmed = line.trim();

            if (!trimmed || trimmed.startsWith('#')) {
                return acc;
            }

            const separatorIndex = trimmed.indexOf('=');

            if (separatorIndex === -1) {
                return acc;
            }

            const key = trimmed.slice(0, separatorIndex).trim();
            const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

            if (!key) {
                return acc;
            }

            acc[key] = value;

            return acc;
        }, {});
};

const loadRootEnv = (mode = process.env.NODE_ENV || 'development') => {
    const fileEnv = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`].reduce<Record<string, string>>(
        (acc, fileName) => Object.assign(acc, parseEnvFile(path.join(workspaceRoot, fileName))),
        {},
    );

    return {
        ...fileEnv,
        ...process.env,
    };
};

const env = loadRootEnv();

const siteOrigin = (value: string | undefined, fallback: string) => stripTrailingSlash(value?.trim() || fallback);

export const docsSiteConfig = {
    marketingOrigin: siteOrigin(env.PUBLIC_MARKETING_SITE_URL, DEFAULT_MARKETING_SITE_URL),
    appOrigin: siteOrigin(env.PUBLIC_APP_SITE_URL, DEFAULT_APP_SITE_URL),
    docsOrigin: siteOrigin(env.PUBLIC_DOCS_SITE_URL, DEFAULT_DOCS_SITE_URL),
};

export const docsSiteLinks = {
    app: docsSiteConfig.appOrigin,
    marketing: docsSiteConfig.marketingOrigin,
    docs: docsSiteConfig.docsOrigin,
};
