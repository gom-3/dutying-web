# 코드베이스 구조 가이드

이 문서는 현재 `dutying-web` 코드베이스에서 실제로 쓰이는 구조를 기준으로 정리한 기준 문서다. 신규 개발과 리뷰에서 "어디에 무엇을 둘지" 빠르게 판단하는 용도로 사용한다.

## 1. 모노레포 구성

```text
apps/
  app/      메인 웹 앱
  docs/     사용자 문서 사이트
  landing/  공개 랜딩 사이트
packages/
  api/      API 계약 / 응답 타입 / app-agnostic adapter contract
  config/   ESLint / TypeScript 공통 설정
  domain/   도메인 타입
  utils/    순수 유틸 / 범용 타입
docs/
  architecture/  구조 규칙 문서
```

### apps 역할

- `apps/app`
    - 실제 제품 기능이 들어가는 메인 웹 앱
    - 루트 `pnpm dev`, `build`, `lint`, `test`, `type-check`의 기본 대상
- `apps/docs`
    - VitePress 기반 사용자 가이드
    - 제품 기능 코드나 내부 구조 규칙의 source of truth는 아니다
- `apps/landing`
    - 서비스 소개용 공개 페이지
    - 제품 앱 로직과 분리해 운영한다

### packages 역할

- `packages/api`
    - API contract, DTO, response type, interface
    - 예: [`packages/api/src/client.ts`](../../packages/api/src/client.ts), [`packages/api/src/ward/contracts.ts`](../../packages/api/src/ward/contracts.ts)
- `packages/domain`
    - 화면/전송 방식에 독립적인 도메인 타입
    - 예: [`packages/domain/src/ward.ts`](../../packages/domain/src/ward.ts)
- `packages/utils`
    - app 문맥 없는 순수 유틸과 범용 타입
    - 예: [`packages/utils/src/date.ts`](../../packages/utils/src/date.ts), [`packages/utils/src/types.ts`](../../packages/utils/src/types.ts)
- `packages/config`
    - workspace 공통 ESLint/TypeScript 설정

## 2. `apps/app/src` 레이어 기준

```text
app/
pages/
widgets/
features/
entities/
shared/
```

### `app`

- 앱 진입점, 라우터, 최상위 provider 조합
- 예: [`apps/app/src/app/Router.tsx`](../../apps/app/src/app/Router.tsx)

### `pages`

- 라우트 entry와 페이지 조합
- URL과 1:1 또는 거의 1:1 대응되는 slice
- 비즈니스 세부 로직을 길게 들고 있지 말고, `widgets`, `features`, `entities`를 조합하는 쪽으로 유지

예:

- [`apps/app/src/pages/duty`](../../apps/app/src/pages/duty)
- [`apps/app/src/pages/make-shift`](../../apps/app/src/pages/make-shift)
- [`apps/app/src/pages/onboarding-ward-create`](../../apps/app/src/pages/onboarding-ward-create)

### `widgets`

- 한 페이지 안에서 큰 단위로 재사용되는 UI 블록
- 여러 feature/entity를 묶지만, 특정 사용자 액션 하나의 규칙을 소유하지는 않는다

예:

- [`apps/app/src/widgets/layouts`](../../apps/app/src/widgets/layouts)
- [`apps/app/src/widgets/navigation-bar`](../../apps/app/src/widgets/navigation-bar)

### `features`

- 사용자 액션, 편집 흐름, 업로드, 인증 등 use case 중심 단위
- UI가 있으면 `ui/`, 상태/행동이 있으면 `model/`에 둔다
- 한 feature가 하나의 도메인 엔티티를 사용할 수는 있지만 엔티티 자체를 소유하지는 않는다

예:

- [`apps/app/src/features/shift-editor`](../../apps/app/src/features/shift-editor)
- [`apps/app/src/features/register-ward`](../../apps/app/src/features/register-ward)
- [`apps/app/src/features/account`](../../apps/app/src/features/account)

### `entities`

- 도메인 모델, queryOptions, 엔티티 전용 표시 UI
- 서버 상태의 기본 정의를 이 레이어에 모은다

예:

- [`apps/app/src/entities/account/model/queries.ts`](../../apps/app/src/entities/account/model/queries.ts)
- [`apps/app/src/entities/ward/model/queries.ts`](../../apps/app/src/entities/ward/model/queries.ts)
- [`apps/app/src/entities/account/ui/profile-image`](../../apps/app/src/entities/account/ui/profile-image)

### `shared`

- 앱 전역 공용 코드
- 단, 어떤 도메인에서도 재사용 가능한 순수 계약/타입/유틸은 `packages/*`가 우선 소유한다
- `shared`에는 앱 런타임 의존성, 공용 UI, 자산, 라우트 상수, 앱 테스트 유틸을 둔다

예:

- 브라우저 런타임 설정: [`apps/app/src/shared/config/runtime.ts`](../../apps/app/src/shared/config/runtime.ts)
- 앱 API client: [`apps/app/src/shared/api/client.ts`](../../apps/app/src/shared/api/client.ts)
- 공용 UI: [`apps/app/src/shared/ui`](../../apps/app/src/shared/ui)

## 3. naming 규칙

### 디렉터리 이름

- 신규 slice 디렉터리는 `kebab-case`를 사용한다.
- 예: `make-shift`, `shift-editor`, `onboarding-ward-create`
- 예약 디렉터리 이름은 그대로 사용한다: `ui`, `model`, `__tests__`

### 파일 이름

- 신규 slice 내부 파일은 `kebab-case`를 기본으로 한다.
- 예: `make-shift-stepper.tsx`, `shift-to-excel.ts`, `use-bootstrap.ts`
- public entry는 `index.ts` 또는 `index.tsx`를 사용한다.
- hook은 `use*`, store는 `*Store`, query 정의는 `*QueryKeys`, `*QueryOptions`로 맞춘다.

예:

- [`apps/app/src/entities/account/model/queries.ts`](../../apps/app/src/entities/account/model/queries.ts)
- [`apps/app/src/pages/make-shift/model/make-shift-use-case.ts`](../../apps/app/src/pages/make-shift/model/make-shift-use-case.ts)

### 타입 이름

- interface는 `I*`
- type alias는 `T*`
- 이 규칙은 [`packages/config/eslint/react-app.mjs`](../../packages/config/eslint/react-app.mjs)에 강제되어 있다.

예:

- [`packages/api/src/client.ts`](../../packages/api/src/client.ts)
- [`packages/domain/src/ward.ts`](../../packages/domain/src/ward.ts)

### 현재 source of truth

- DUT-936 기준으로 `apps/app/src/pages/*`, `apps/app/src/features/*`의 slice는 `kebab-case` + `index.ts(x)` + `ui/` + `model/` 규칙으로 정리되어 있다.
- 신규 page/feature slice는 이 기준을 그대로 따른다.
- 특히 slice 루트에 `components/`, `hooks/`, `view/`를 병렬로 두는 방식은 더 이상 늘리지 않는다.

## 4. page / feature slice 규칙

신규 `pages/*`, `features/*`는 기본적으로 아래 형태를 따른다.

```text
slice-name/
├── index.tsx
├── model/
└── ui/
```

### `index.ts(x)`

- slice의 public entry
- page라면 route entry component
- feature라면 외부에서 가져다 쓰는 진입점

### `ui/`

- 화면 조합 컴포넌트
- 표시 로직
- 세부 단계가 있으면 `ui/steps`, `ui/toolbar`처럼 `ui/` 아래에서만 확장

### `model/`

- hook
- store
- adapter
- type
- 계산 로직
- 테스트는 가장 가까운 owner 아래에 둔다
- 계산/상태 로직: `model/__tests__`
- route entry 또는 slice public entry 테스트: slice 루트 `__tests__`

### 허용되는 축약

- UI가 없는 feature는 `model/`만 둘 수 있다
- 단순 route page는 `index.tsx`만 둘 수 있다
- 빈 `ui/`, `model/` 디렉터리를 만들지 않는다

### 금지되는 신규 패턴

- slice 루트에 `view/`, `components/`, `hooks/`를 병렬로 두는 패턴
- model 성격 파일을 slice 루트에 평평하게 계속 추가하는 패턴

### 예시

- `pages` 예시

```text
apps/app/src/pages/make-shift/
├── index.tsx
├── model/
└── ui/
```

- `feature` 예시

```text
apps/app/src/features/account/
└── model/
```

- `feature` 예시

```text
apps/app/src/features/shift-editor/
├── index.ts
├── model/
└── ui/
```

정리된 소형 feature 예시:

```text
apps/app/src/features/file/
├── index.ts
└── model/
```

## 5. shared 와 packages 경계

원칙은 간단하다.

- 앱 런타임을 직접 알면 `apps/app/src/shared/*`
- 앱과 무관하게 재사용 가능한 계약/타입/유틸이면 `packages/*`
- 특정 페이지/기능 흐름을 알면 `shared`가 아니라 더 가까운 `pages/*`, `features/*`, `widgets/*`

### 판단 질문

1. 브라우저 전역, router, toast, `import.meta.env`를 직접 아는가?
2. 다른 app에서도 같은 코드 그대로 쓸 수 있는가?
3. 단순 재수출 없이 package를 직접 import 할 수 있는가?

판단 결과:

- 1번이 `예`면 `apps/app/src/shared/*`
- 2번이 `예`면 `packages/*`
- 3번이 `예`면 app shared에 compat layer를 만들지 말고 package를 바로 사용

자세한 기준과 예시는 [shared 경계 기준](./shared-boundary.md)을 따른다.

## 6. 리뷰 체크리스트

- 새 코드가 `pages/widgets/features/entities/shared/packages` 중 올바른 레이어에 들어갔는가?
- 신규 page/feature가 `index + ui + model` 기준을 따르는가?
- `shared`에 도메인 맥락이 새어 들어오지 않았는가?
- `packages/*`로 올릴 수 있는 코드를 app 내부에 가둬두지 않았는가?
- 신규 파일 naming이 `kebab-case`와 `index.ts(x)` 규칙을 따르는가?

## 7. DUT-936 마감 기준

- 이 티켓의 목적은 구조 규칙을 하나의 기준으로 고정하고, 현재 코드와 문서의 모순을 해소하는 것이다.
- `apps/app/src/pages/*`, `apps/app/src/features/*`, 구조 문서는 현재 기준으로 정렬되어 있어 DUT-936 마감 조건을 충족한다.
- 이후 후속 작업이 생기더라도 그것은 새 구조 개편이나 추가 추상화 논의이지, 현재 규칙 정합성의 미해결 항목은 아니다.
