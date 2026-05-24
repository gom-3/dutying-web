import fs from 'node:fs';
import path from 'node:path';

const stripQuotes = (value) => {
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }

    return value;
};

const parseEnvFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return fs
        .readFileSync(filePath, 'utf8')
        .split(/\r?\n/)
        .reduce((acc, line) => {
            const trimmed = line.trim();

            if (!trimmed || trimmed.startsWith('#')) {
                return acc;
            }

            const separatorIndex = trimmed.indexOf('=');

            if (separatorIndex === -1) {
                return acc;
            }

            const key = trimmed.slice(0, separatorIndex).trim();
            const value = trimmed.slice(separatorIndex + 1).trim();

            if (!key) {
                return acc;
            }

            acc[key] = stripQuotes(value);

            return acc;
        }, {});
};

export const loadRootEnv = (workspaceRoot, mode = process.env.NODE_ENV || 'development') => {
    const candidates = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];

    const fileEnv = candidates.reduce(
        (acc, fileName) => Object.assign(acc, parseEnvFile(path.join(workspaceRoot, fileName))),
        {},
    );

    return {
        ...fileEnv,
        ...process.env,
    };
};
