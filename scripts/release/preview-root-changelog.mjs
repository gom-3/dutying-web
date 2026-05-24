import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {getNextReleaseVersion, readPendingChangesets, readRootVersion, renderReleaseEntry} from './changelog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const currentVersion = await readRootVersion(rootDir);
const pendingChangesets = await readPendingChangesets(rootDir);
const nextVersion = getNextReleaseVersion(currentVersion, pendingChangesets);

console.log(`Current release version: ${currentVersion}`);
console.log(`Planned release version: ${nextVersion}`);
console.log('');
console.log(renderReleaseEntry({version: nextVersion, changesets: pendingChangesets}));
