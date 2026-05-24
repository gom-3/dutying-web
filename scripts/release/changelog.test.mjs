import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
    getDefaultChangelogContent,
    getNextReleaseVersion,
    readPendingChangesets,
    renderReleaseEntry,
    upsertReleaseEntry,
    writeRootChangelog,
} from './changelog.mjs';

test('readPendingChangesets parses release metadata and summaries', async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'dutying-changesets-'));
    const changesetDir = path.join(rootDir, '.changeset');

    await mkdir(changesetDir, {recursive: true});
    await writeFile(
        path.join(changesetDir, 'alpha.md'),
        `---
'@dutying/app': minor
'@dutying/utils': patch
---

공통 유틸과 앱 변경사항을 묶습니다.
`,
    );
    await writeFile(path.join(changesetDir, 'README.md'), '# ignored');

    const changesets = await readPendingChangesets(rootDir);

    assert.equal(changesets.length, 1);
    assert.deepEqual(changesets[0].releases, [
        {packageName: '@dutying/app', releaseType: 'minor'},
        {packageName: '@dutying/utils', releaseType: 'patch'},
    ]);
    assert.equal(changesets[0].summary, '공통 유틸과 앱 변경사항을 묶습니다.');
});

test('getNextReleaseVersion uses the highest pending release type', () => {
    const changesets = [
        {
            releases: [
                {packageName: '@dutying/app', releaseType: 'patch'},
                {packageName: '@dutying/docs', releaseType: 'minor'},
            ],
            summary: 'summary',
        },
    ];

    assert.equal(getNextReleaseVersion('1.0.2', changesets), '1.1.0');
});

test('renderReleaseEntry and upsertReleaseEntry keep newest version first', () => {
    const entry = renderReleaseEntry({
        version: '1.1.0',
        date: '2026-03-24',
        changesets: [
            {
                releases: [{packageName: '@dutying/app', releaseType: 'minor'}],
                summary: '새 duty 편집 흐름을 추가합니다.',
            },
        ],
    });

    const updated = upsertReleaseEntry(
        `${getDefaultChangelogContent()}\n## 1.0.2 - 2026-03-20\n\n- \`@dutying/app\` (patch): 기존 항목입니다.\n`,
        entry,
        '1.1.0',
    );

    assert.match(updated, /^# CHANGELOG[\s\S]*## 1\.1\.0 - 2026-03-24[\s\S]*## 1\.0\.2 - 2026-03-20/m);
});

test('writeRootChangelog creates a root changelog file when missing', async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'dutying-changelog-'));

    await writeRootChangelog({
        rootDir,
        version: '1.1.0',
        date: '2026-03-24',
        changesets: [
            {
                releases: [{packageName: '@dutying/app', releaseType: 'minor'}],
                summary: 'CHANGELOG 생성 흐름을 정리합니다.',
            },
        ],
    });

    const changelog = await readFile(path.join(rootDir, 'CHANGELOG.md'), 'utf8');

    assert.match(changelog, /^# CHANGELOG/m);
    assert.match(changelog, /## 1\.1\.0 - 2026-03-24/);
    assert.match(changelog, /CHANGELOG 생성 흐름을 정리합니다\./);
});
