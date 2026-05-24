import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const CHANGESET_DIRECTORY = '.changeset';
const CHANGESET_README = 'README.md';
const CHANGELOG_FILE = 'CHANGELOG.md';
const ROOT_PACKAGE_FILE = 'package.json';

const RELEASE_TYPE_PRIORITY = {
    patch: 0,
    minor: 1,
    major: 2,
};

const DEFAULT_CHANGELOG_CONTENT = `# CHANGELOG

Repository-level release notes for \`dutying-web\`.

This repository uses one shared version across all workspaces, so release notes are maintained only in this root file. Package-level changelogs are intentionally disabled.

Entries are generated from pending \`.changeset/*.md\` files when \`pnpm run changeset:version\` or \`pnpm run release:version\` is executed.
`;

function normalizeLineEndings(content) {
    return content.replace(/\r\n/g, '\n');
}

function createChangesetParseError(fileName) {
    return new Error(`Failed to parse ${fileName}. Expected frontmatter with package release types.`);
}

export async function readRootVersion(rootDir) {
    const packageJsonPath = path.join(rootDir, ROOT_PACKAGE_FILE);
    const rootPackage = JSON.parse(await readFile(packageJsonPath, 'utf8'));

    if (typeof rootPackage.version !== 'string' || rootPackage.version.trim() === '') {
        throw new Error('Root package.json is missing a valid version.');
    }

    return rootPackage.version;
}

export async function readPendingChangesets(rootDir) {
    const changesetDir = path.join(rootDir, CHANGESET_DIRECTORY);
    const entries = await readdir(changesetDir, {withFileTypes: true});
    const changesetFiles = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== CHANGESET_README)
        .map((entry) => entry.name)
        .sort();

    const changesets = await Promise.all(
        changesetFiles.map(async (fileName) => {
            const filePath = path.join(changesetDir, fileName);
            const rawContent = normalizeLineEndings(await readFile(filePath, 'utf8'));
            const match = rawContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

            if (!match) {
                throw createChangesetParseError(fileName);
            }

            const [, frontmatter, summaryBlock] = match;
            const releases = frontmatter
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const lineMatch = line.match(/^(?:'([^']+)'|"([^"]+)"|([^:]+)):\s*(major|minor|patch)\s*$/);

                    if (!lineMatch) {
                        throw createChangesetParseError(fileName);
                    }

                    const packageName = (lineMatch[1] ?? lineMatch[2] ?? lineMatch[3]).trim();
                    const releaseType = lineMatch[4];

                    return {packageName, releaseType};
                });

            if (releases.length === 0) {
                throw createChangesetParseError(fileName);
            }

            const summary = summaryBlock.trim();

            if (summary === '') {
                throw new Error(`Changeset ${fileName} is missing a summary body.`);
            }

            return {
                fileName,
                releases,
                summary,
            };
        }),
    );

    if (changesets.length === 0) {
        throw new Error('No pending changesets were found in .changeset/.');
    }

    return changesets;
}

export function getNextReleaseVersion(currentVersion, changesets) {
    const parts = currentVersion.split('.').map((value) => Number.parseInt(value, 10));

    if (parts.length !== 3 || parts.some((value) => Number.isNaN(value) || value < 0)) {
        throw new Error(`Unsupported semantic version: ${currentVersion}`);
    }

    const highestReleaseType = changesets
        .flatMap((changeset) => changeset.releases)
        .reduce((currentHighest, release) => {
            if (!currentHighest) {
                return release.releaseType;
            }

            return RELEASE_TYPE_PRIORITY[release.releaseType] > RELEASE_TYPE_PRIORITY[currentHighest]
                ? release.releaseType
                : currentHighest;
        }, null);

    if (!highestReleaseType) {
        throw new Error('Could not determine the next release type from pending changesets.');
    }

    const [major, minor, patch] = parts;

    switch (highestReleaseType) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            throw new Error(`Unsupported release type: ${highestReleaseType}`);
    }
}

export function getReleaseDate(date = new Date()) {
    return new Intl.DateTimeFormat('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}

export function renderReleaseEntry({version, changesets, date = getReleaseDate()}) {
    const lines = changesets.map((changeset) => {
        const releaseTargets = changeset.releases
            .slice()
            .sort((left, right) => left.packageName.localeCompare(right.packageName))
            .map((release) => `\`${release.packageName}\` (${release.releaseType})`)
            .join(', ');

        return `- ${releaseTargets}: ${changeset.summary}`;
    });

    return [`## ${version} - ${date}`, '', ...lines].join('\n');
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function upsertReleaseEntry(existingContent, entry, version) {
    const normalizedContent = normalizeLineEndings(existingContent).trim();
    const baseContent = normalizedContent === '' ? DEFAULT_CHANGELOG_CONTENT.trim() : normalizedContent;
    const sectionPattern = new RegExp(`^## ${escapeRegExp(version)} - .*?(?=^## |\\Z)`, 'ms');
    const contentWithoutCurrentVersion = baseContent.replace(sectionPattern, '').trim();
    const firstReleaseHeadingIndex = contentWithoutCurrentVersion.search(/^## \d+\.\d+\.\d+ - /m);

    if (firstReleaseHeadingIndex === -1) {
        return `${contentWithoutCurrentVersion}\n\n${entry.trim()}\n`;
    }

    const preamble = contentWithoutCurrentVersion.slice(0, firstReleaseHeadingIndex).trimEnd();
    const remainingEntries = contentWithoutCurrentVersion.slice(firstReleaseHeadingIndex).trimStart();

    return `${preamble}\n\n${entry.trim()}\n\n${remainingEntries}\n`;
}

export async function writeRootChangelog({rootDir, version, changesets, date = getReleaseDate()}) {
    const changelogPath = path.join(rootDir, CHANGELOG_FILE);
    const existingContent = await readFile(changelogPath, 'utf8').catch((error) => {
        if (error.code === 'ENOENT') {
            return '';
        }

        throw error;
    });
    const nextContent = upsertReleaseEntry(existingContent, renderReleaseEntry({version, changesets, date}), version);

    await writeFile(changelogPath, nextContent);
}

export function getDefaultChangelogContent() {
    return `${DEFAULT_CHANGELOG_CONTENT.trim()}\n`;
}
