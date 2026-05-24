<img width="1510" alt="image" src="https://github.com/gom-3/dutying-web/assets/73516336/609319d4-8560-411e-a65e-206912bc09e7">

<p align='center'>
  <img src='https://img.shields.io/github/package-json/v/gom-3/dutying-web'>
  <a href="https://github.com/gom-3/dutying-web/issues"><img src='https://img.shields.io/github/issues/gom-3/dutying-web'></a>
  <a href="https://github.com/gom-3/dutying-web/pulls"><img src='https://img.shields.io/github/issues-pr/gom-3/dutying-web'></a>
  <a href="https://github.com/gom-3/dutying-web/graphs/contributors"><img src='https://img.shields.io/github/contributors/gom-3/dutying-web'></a>
  <a href='https://github.com/gom-3/dutying-web/blob/main/LICENSE'><img src='https://img.shields.io/github/license/gom-3/dutying-web'></a>
</p>

듀팅 웹 서비스의 앱, 랜딩, 문서 사이트를 함께 관리하는 `pnpm workspace` 모노레포입니다.

- 웹 앱: 수간호사/관리자용 근무표 운영 제품
- 랜딩: 서비스 소개용 공개 사이트
- 문서 앱: 사용자 가이드와 FAQ
- 공통 패키지: API 계약, 도메인 타입, 유틸, 설정

## Workspace Overview

```text
.
├── apps
│   ├── app        # 메인 웹 앱 (Vite + React)
│   ├── docs       # 사용자 문서 사이트 (VitePress)
│   └── landing    # 공개 랜딩 사이트 (Astro)
├── packages
│   ├── api        # 앱 간 재사용 가능한 API 계약 / adapter factory
│   ├── config     # workspace 공통 ESLint / TypeScript 설정
│   ├── domain     # 화면과 전송 방식에 독립적인 도메인 타입
│   └── utils      # 순수 유틸 / 범용 타입
└── docs
    └── architecture
        ├── codebase-structure.md
        └── shared-boundary.md
```

## 현재 기본 실행 대상

루트 스크립트의 기본 대상은 `apps/app`입니다.

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm type-check`

문서 앱과 랜딩 앱은 suffix 스크립트로 실행합니다.

- `pnpm dev:docs`
- `pnpm build:docs`
- `pnpm type-check:docs`
- `pnpm dev:landing`
- `pnpm build:landing`
- `pnpm type-check:landing`

## 앱 구조 규칙 요약

메인 앱은 `apps/app/src`에서 FSD에 가까운 레이어 구조를 사용합니다.

- `app`: 라우터와 최상위 앱 설정
- `pages`: 라우트 entry. 페이지 조합과 진입 책임만 둠
- `widgets`: 페이지 단위로 재사용되는 큰 UI 블록
- `features`: 사용자 액션과 use case
- `entities`: 도메인 모델, queryOptions, 엔티티 UI
- `shared`: 앱 전역 공용 UI, 런타임 의존 코드, 자산, 범용 유틸

신규 `pages/*`, `features/*`는 아래 구조를 기본으로 합니다.

```text
slice-name/
├── index.tsx
├── model/
└── ui/
```

- `ui/`: 화면 조합 컴포넌트와 표시 로직
- `model/`: hook, store, adapter, type, 계산 로직
- 하위 단계가 필요하면 `ui/...`, `model/...` 아래에서만 확장

`apps/app/src/pages/*`와 `apps/app/src/features/*`는 DUT-936 기준으로 `kebab-case` + `index.ts(x)` + `ui/` + `model/` 규칙에 맞춰 정리했습니다. 신규 slice도 같은 기준을 그대로 따릅니다.

구조 기준 상세 문서:

- [코드베이스 구조 가이드](docs/architecture/codebase-structure.md)
- [shared 와 packages 경계 기준](docs/architecture/shared-boundary.md)

## 빠른 배치 기준

- 라우트 자체라면 `apps/app/src/pages/*`
- 여러 페이지에서 재사용하는 화면 블록이라면 `apps/app/src/widgets/*`
- 특정 사용자 액션/업무 기능이라면 `apps/app/src/features/*`
- 도메인 조회 모델이나 엔티티 UI라면 `apps/app/src/entities/*`
- 브라우저 런타임에 묶인 공용 코드라면 `apps/app/src/shared/*`
- 다른 앱에서도 그대로 쓸 계약/타입/유틸이라면 `packages/*`
- package를 직접 import 할 수 있는 계약/타입은 `shared` 재수출 대신 `packages/*`를 바로 사용

예시:

- 라우트 등록과 lazy import: [`apps/app/src/app/Router.tsx`](apps/app/src/app/Router.tsx)
- page slice 예시: [`apps/app/src/pages/make-shift`](apps/app/src/pages/make-shift)
- feature slice 예시: [`apps/app/src/features/shift-editor`](apps/app/src/features/shift-editor)
- packages 예시: [`packages/api`](packages/api), [`packages/domain`](packages/domain), [`packages/utils`](packages/utils)

## 개발 명령어

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm type-check
pnpm workspace:list
```

## 기술 스택

- 메인 앱: React 19, TypeScript, Vite
- 문서 앱: VitePress
- 랜딩 앱: Astro
- 상태 관리: TanStack Query, Zustand
- 스타일링: Tailwind CSS
- 테스트: Vitest, Cypress
- 모니터링/분석: Sentry, Google Analytics, Meta Pixel
- 패키지 관리: pnpm workspace

## 테스트와 CI

- 로컬 단위 테스트: `pnpm test`
- 로컬 커버리지: `pnpm coverage`
- 로컬 E2E: `pnpm e2e`
- 타입 체크: `pnpm type-check`

GitHub Actions:

- [`vitest.yml`](.github/workflows/vitest.yml): Pull Request 시 `pnpm coverage` 실행
- [`cypress.yml`](.github/workflows/cypress.yml): Push 시 Cypress E2E 실행

## 릴리즈 메모

- 모든 workspace는 동일한 버전을 사용합니다.
- Changesets는 workspace 버전, 각 workspace `CHANGELOG.md`, 루트 `package.json`, 루트 `CHANGELOG.md`를 함께 동기화합니다.
- 로컬에서 release 기반을 점검할 때는 `pnpm run release:verify`를 먼저 실행합니다.
- 일반적인 릴리즈 준비 순서:

```bash
pnpm run changeset:add
pnpm run release:verify
pnpm run changeset:version
```

### GitHub Actions Release Automation

- Pushes to `develop` run the release PR automation in [`.github/workflows/release-pr.yml`](./.github/workflows/release-pr.yml). It creates or updates a single release PR by running `pnpm run release:version` on top of pending `.changeset/*.md` files, including workspace changelog updates.
- The release PR workflow also runs `pnpm run release:test` first so the custom root changelog helpers fail fast before the PR branch is updated.
- Pushes to `main` run the GitHub release automation in [`.github/workflows/github-release.yml`](./.github/workflows/github-release.yml). It reads the root version, extracts the matching root changelog section, and creates the `v{version}` GitHub Release.
- The repository keeps the existing branch strategy: merge feature work into `develop`, merge the generated release PR into `develop` when the next version is ready, cut `release/{version}` for QA, and merge that branch into `main` to publish the GitHub Release.
- Operational details and prerequisites are documented in [`docs/release-automation.md`](./docs/release-automation.md).

## 링크

- 랜딩: [https://dutying.net](https://dutying.net)
- 웹 앱: [https://app.dutying.net](https://app.dutying.net)
- 가이드 문서 사이트: [https://docs.dutying.net](https://docs.dutying.net)
- 모바일 앱 저장소: [gom-3/dutying-mobile](https://github.com/gom-3/dutying-mobile)
- 이용 약관: [Notion](https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4)
- 라이선스: [Apache License 2.0](LICENSE)
