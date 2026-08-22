# CHANGELOG

Repository-level release notes for `dutying-web`.

This repository uses one shared version across all workspaces, so release notes are maintained only in this root file. Package-level changelogs are intentionally disabled.

Entries are generated from pending `.changeset/*.md` files when `pnpm run changeset:version` or `pnpm run release:version` is executed.

## 1.1.0 - 2026-08-22

- `@dutying/config` (minor), `@dutying/docs` (minor), `@dutying/landing` (minor): 공용 설정 패키지와 별도 landing, docs 워크스페이스를 초기 분리합니다.
- `@dutying/app` (minor): 근무표 확인 및 편집을 위한 duty 페이지를 추가하고 관련 편집 흐름을 개선합니다.
- `@dutying/app` (minor): 센트리 추적 추가
