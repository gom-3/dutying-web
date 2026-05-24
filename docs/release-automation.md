# Release Automation

`dutying-web` release automation is intentionally minimal and follows the current branch strategy:

1. Feature work lands on `develop` with one or more `.changeset/*.md` files.
2. GitHub Actions opens or updates one release PR on top of `develop`.
3. When the team is ready to cut a release, merge that release PR into `develop`.
4. Create `release/x.y.z` from the updated `develop` commit for QA.
5. After QA, merge `release/x.y.z` into `main`.
6. A second GitHub Actions workflow creates the GitHub Release and `vx.y.z` tag from the merged `main` commit.

## Workflows

### 1. Release PR (`.github/workflows/release-pr.yml`)

- Trigger: every push to `develop`
- Purpose: connect pending Changesets to a single release PR
- Action:
    - runs `pnpm run release:version`
    - bumps aligned workspace versions through Changesets
    - appends release notes to each changed workspace `CHANGELOG.md`
    - syncs the root `package.json` version
    - prepends the root `CHANGELOG.md`
    - removes consumed `.changeset/*.md` files in the release PR branch
- Result: the repository always has one reviewable "release prep" PR instead of a manual version/changelog commit flow

### 2. GitHub Release (`.github/workflows/github-release.yml`)

- Trigger: every push to `main`
- Purpose: convert the already-approved release commit into a GitHub Release
- Action:
    - reads the root `package.json` version
    - skips when a GitHub Release already exists for `v<version>`
    - extracts the matching root `CHANGELOG.md` section
    - creates the GitHub Release and tag

## Operator Flow

1. Add a Changeset in every feature/fix PR that should be reflected in the next release.
2. Before merging that work, run `pnpm run release:verify` locally when you need to confirm the current Changesets, planned version bump, and root changelog output in one pass.
3. Merge the normal work into `develop`.
4. Wait for the Release PR workflow to open or refresh the release PR.
5. Review the generated version bumps and root changelog entry.
6. Merge the release PR when you want to freeze the next release candidate.
7. Create `release/<root-version>` from that `develop` commit and run QA as usual.
8. Merge the release branch into `main`.
9. Confirm that the GitHub Release workflow created `v<root-version>`.

## Required Repository Settings

- GitHub Actions must be enabled for the repository.
- The repository-level `GITHUB_TOKEN` permission must allow write access so workflows can push the release PR branch and create releases.
- No extra npm publishing secret is required because all workspaces are still `private: true`.
- Existing Cypress secrets (`TESTING_ID`, `TESTING_PW`, `TESTING_HOST`) are unchanged and stay owned by the current test workflow.

## Failure Modes To Watch

- If a change reaches `develop` without a `.changeset/*.md`, the release PR will not include it in the next version/changelog update.
- If someone manually edits versions without the normal Changesets flow, the `main` release workflow can fail because the matching root `CHANGELOG.md` section is missing.
- The GitHub Release is created only after `main` receives the release commit, not when the release PR is merged into `develop`.
- `pnpm run release:verify` is a local preflight only. It validates the custom changelog helpers, prints the pending version bump, and previews the next root changelog entry, but it does not modify tracked files.
