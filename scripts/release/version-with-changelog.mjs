import path from 'node:path';
import process from 'node:process';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

import {getNextReleaseVersion, readPendingChangesets, readRootVersion, writeRootChangelog} from './changelog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: rootDir,
            stdio: 'inherit',
            env: {...process.env, CI: '1'},
        });

        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
        });
    });
}

const currentVersion = await readRootVersion(rootDir);
const pendingChangesets = await readPendingChangesets(rootDir);
const plannedVersion = getNextReleaseVersion(currentVersion, pendingChangesets);

await runCommand('pnpm', ['run', 'changeset:version:workspaces']);
await runCommand('pnpm', ['run', 'changeset:sync-root-version']);

const resolvedVersion = await readRootVersion(rootDir);

if (resolvedVersion !== plannedVersion) {
    console.warn(`Planned release version ${plannedVersion} did not match resolved version ${resolvedVersion}.`);
}

await writeRootChangelog({
    rootDir,
    version: resolvedVersion,
    changesets: pendingChangesets,
});

console.log(`Generated root CHANGELOG.md for ${resolvedVersion}.`);
