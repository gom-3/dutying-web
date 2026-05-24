# shared 경계 기준

이 문서는 `apps/app/src/shared/*`와 `packages/*`의 책임을 나누는 기준만 따로 정리한다. 구조 전체 기준은 [코드베이스 구조 가이드](./codebase-structure.md)를 본다.

## 핵심 원칙

- `shared`는 앱 전역에서 재사용되지만 여전히 `app` 런타임과 가깝다.
- `packages/*`는 다른 앱에서도 그대로 사용할 수 있는 계약, 타입, 순수 유틸을 소유한다.
- 화면 흐름이나 업무 플로우를 알면 `shared`가 아니라 더 가까운 slice가 소유한다.

## 현재 ownership

### `apps/app/src/shared/*`

- 브라우저/라우터/토스트/환경변수처럼 앱 런타임을 직접 아는 코드
- 앱 전용 공용 UI
- 앱 라우트 상수, 로컬 자산, 테스트 유틸

현재 코드 예시:

- [`apps/app/src/shared/api/client.ts`](../../apps/app/src/shared/api/client.ts)
    - `axios`, `toast`, `window.location`, `import.meta.env`를 직접 사용
- [`apps/app/src/shared/api/account`](../../apps/app/src/shared/api/account)
- [`apps/app/src/shared/api/nurse`](../../apps/app/src/shared/api/nurse)
- [`apps/app/src/shared/api/ward`](../../apps/app/src/shared/api/ward)
    - `packages/api` 계약에 app 전용 `axiosInstance`와 app 전용 endpoint를 결합하는 integration layer
- [`apps/app/src/shared/api/file`](../../apps/app/src/shared/api/file)
- [`apps/app/src/shared/api/auth`](../../apps/app/src/shared/api/auth)
- [`apps/app/src/shared/config/runtime.ts`](../../apps/app/src/shared/config/runtime.ts)
    - 앱 URL, redirect 안전성, env fallback을 관리
- [`apps/app/src/shared/ui/primitives`](../../apps/app/src/shared/ui/primitives)
- [`apps/app/src/shared/ui/form-controls`](../../apps/app/src/shared/ui/form-controls)

### `packages/api`

- API interface
- DTO / response type
- app-agnostic contract

현재 코드 예시:

- [`packages/api/src/client.ts`](../../packages/api/src/client.ts)
- [`packages/api/src/ward/contracts.ts`](../../packages/api/src/ward/contracts.ts)

### `packages/domain`

- 비즈니스 도메인 타입
- 화면이나 전송 방식과 무관한 모델

현재 코드 예시:

- [`packages/domain/src/account.ts`](../../packages/domain/src/account.ts)
- [`packages/domain/src/ward.ts`](../../packages/domain/src/ward.ts)

### `packages/utils`

- 순수 함수
- 범용 타입
- app 문맥 없는 스타일/날짜 유틸

현재 코드 예시:

- [`packages/utils/src/date.ts`](../../packages/utils/src/date.ts)
- [`packages/utils/src/style.ts`](../../packages/utils/src/style.ts)
- [`packages/utils/src/types.ts`](../../packages/utils/src/types.ts)

### `packages/config`

- workspace 공통 TypeScript / ESLint 설정

## 배치 판단 질문

1. 이 코드가 브라우저 전역, router, toast, `import.meta.env`를 직접 아는가?
2. 이 코드가 `apps/app` 밖에서도 그대로 재사용 가능한가?
3. 이 코드가 특정 페이지 흐름이나 기능 플로우를 알아야 하는가?

판단 방법:

- 1번이 `예`면 `apps/app/src/shared/*`
- 2번이 `예`면 `packages/*`
- 3번이 `예`면 `shared`가 아니라 `pages/*`, `features/*`, `widgets/*`로 올린다

## `shared`에 남길 것

- 도메인 지식 없이 쓸 수 있는 primitive UI
- 앱 전역 폼 컨트롤, 상태 표시 컴포넌트
- 앱 라우트/런타임/번역/테스트 유틸

## `shared`에서 빼야 할 것

- 특정 도메인 타입을 직접 아는 순수 유틸
- 근무표 편집, 신청근무 처리, 병동 생성 같은 업무 플로우
- 다른 앱에서도 쓸 수 있는 API response type, DTO, 범용 타입
- package를 한 번 더 감싸기만 하는 compat re-export

단, `packages/api` factory에 app 전용 `axiosInstance`를 주입해 실제 런타임 client를 만드는 코드는 `apps/app/src/shared/api/*`에 둔다. 이 계층은 package 소유권을 침범하는 것이 아니라 app integration 역할이다.

## 현재 코드 기준 예시

- `IApiClient` 같은 계약은 `packages/api`
- `axios` 인스턴스와 인증 실패 redirect 처리처럼 브라우저 런타임에 묶인 코드는 `apps/app/src/shared/api`
- `TWard`, `TNurse` 같은 도메인 타입은 `packages/domain`
- `TPartialByKey` 같은 범용 타입은 `packages/utils`
- 페이지 전용 섹션 헤더 조합이나 특정 편집 흐름 UI는 `shared`가 아니라 해당 `pages/*`, `features/*`, `widgets/*`

## 리뷰 시 확인할 것

- `shared` 신규 파일이 도메인 타입 import 없이도 성립하는가?
- `packages/*`로 옮길 수 있는 코드를 app 내부에 중복 생성하지 않았는가?
- package를 직접 import 할 수 있는데 app shared re-export를 추가하지 않았는가?
- 특정 화면이나 기능 흐름을 아는 코드가 `shared`에 들어오지 않았는가?
