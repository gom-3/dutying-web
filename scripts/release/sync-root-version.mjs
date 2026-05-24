import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

async function listWorkspacePackageJsonPaths(directory) {
    const directoryPath = path.join(rootDir, directory);
    const entries = await readdir(directoryPath, {withFileTypes: true});

    return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(directoryPath, entry.name, 'package.json'));
}

async function readPackageManifest(packageJsonPath) {
    const manifest = JSON.parse(await readFile(packageJsonPath, 'utf8'));

    return {
        path: packageJsonPath,
        name: manifest.name,
        version: manifest.version,
        manifest,
    };
}

async function syncRootVersion() {
    const workspacePackageJsonPaths = [
        ...(await listWorkspacePackageJsonPaths('apps')),
        ...(await listWorkspacePackageJsonPaths('packages')),
    ];

    const workspacePackages = await Promise.all(workspacePackageJsonPaths.map(readPackageManifest));

    if (workspacePackages.length === 0) {
        throw new Error('No workspace packages were found under apps/* or packages/*.');
    }

    const versionGroups = new Map();

    for (const workspacePackage of workspacePackages) {
        const packagesAtVersion = versionGroups.get(workspacePackage.version) ?? [];
        packagesAtVersion.push(workspacePackage.name);
        versionGroups.set(workspacePackage.version, packagesAtVersion);
    }

    if (versionGroups.size !== 1) {
        const details = [...versionGroups.entries()].map(([version, packageNames]) => `${version}: ${packageNames.join(', ')}`).join('\n');

        throw new Error(`Workspace package versions are not aligned.\n${details}`);
    }

    const [releaseVersion] = versionGroups.keys();
    const rootPackageJsonPath = path.join(rootDir, 'package.json');
    const rootPackage = JSON.parse(await readFile(rootPackageJsonPath, 'utf8'));
    const previousRootVersion = rootPackage.version;

    if (previousRootVersion === releaseVersion) {
        console.log(`Root package version already aligned at ${releaseVersion}.`);
        return;
    }

    rootPackage.version = releaseVersion;
    await writeFile(rootPackageJsonPath, `${JSON.stringify(rootPackage, null, 4)}\n`);

    console.log(`Synchronized root package version: ${previousRootVersion} -> ${releaseVersion}.`);
}

await syncRootVersion();
