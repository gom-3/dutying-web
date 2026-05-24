# Tauri desktop wrapper 대응 검토

## 결론

- 현재 `apps/app`은 React SPA와 API 서버 분리가 명확해서 `Tauri` webview로 감싸는 방향 자체는 가능하다.
- 다만 인증 복귀 URL, refresh cookie 정책, 브라우저 API 직접 사용, 다운로드/클립보드/외부 링크 처리, 배포 도메인 하드코딩은 desktop 전환 전에 기준을 먼저 정해야 한다.
- 이번 단계에서는 실제 `apps/desktop` scaffold 없이도 후속 티켓을 쪼갤 수 있을 만큼의 위험 구간을 식별했다.

## 유지 가능한 영역

- 라우팅, 화면 구성, 대부분의 상태 관리와 API 호출 구조는 그대로 유지 가능하다.
- `@dutying/api`, `@dutying/domain`, `@dutying/utils` 같은 워크스페이스 패키지는 desktop wrapper 추가 시에도 재사용 가능하다.
- `axios` 기반 API 계층은 transport adapter만 정리하면 webview 안에서도 계속 사용할 수 있다.

## 주요 리스크와 제약

### 1. 인증과 redirect

- 로그인 시작점이 `${VITE_SERVER_URL}/oauth2/authorization/*?nextPageUrl=${appOrigin}/make` 형식이라, 현재는 브라우저 origin이 곧 복귀 주소라는 가정이 있다.
- `RedirectPage`는 querystring의 `accessToken`, `nextPageUrl`을 바로 읽는다. Tauri에서는 `https://app.dutying.net`, `tauri://localhost`, custom scheme, loopback URL 중 무엇을 복귀 주소로 쓸지 먼저 정해야 한다.
- refresh는 `withCredentials: true` 쿠키 기반이며 401 발생 시 `/refresh?next=...`로 강제 이동한다. desktop에서 webview cookie jar가 서버의 `SameSite`, `Secure`, domain 정책과 호환되는지 점검이 필요하다.
- 이번 변경으로 로그인 시작 URL은 `VITE_APP_PUBLIC_URL` 우선, 브라우저 origin fallback 방식으로 정리했다. desktop에서는 이 값을 명시적으로 주입하는 쪽이 안전하다.

### 2. 브라우저 전용 API

- 직접 사용 확인:
    - `window.location`, `window.history`, `window.scroll`, `window.dispatchEvent`
    - `document.*`, `createPortal`, DOM query 및 style 조작
    - `navigator.clipboard.readText/writeText`
    - `window.localStorage`
    - `Blob`, `URL.createObjectURL`, `<a download>`
- 대부분 Tauri webview 안에서도 동작 가능하지만, 권한/UX/플랫폼 차이 때문에 adapter가 필요한 후보가 명확하다.

### 3. 도메인/환경 변수 하드코딩

- 앱 내부에 `app.dutying.net`, Notion 문서 URL, S3 bucket base URL이 직접 박혀 있었다.
- 이 값들은 desktop 전용 배포 채널, staging, custom scheme 실험 시 매번 코드 수정 포인트가 된다.
- `VITE_APP_PUBLIC_URL`, `VITE_PUBLIC_S3_BASE_URL`, 문서 URL env를 두고 런타임 구성으로 노출하는 편이 안전하다.

### 4. 파일 업로드/다운로드와 저장소 접근

- 업로드는 브라우저 `File` 객체 + presigned URL PUT 방식이라 Tauri에서도 파일 picker가 webview `File`을 넘겨주면 유지 가능하다.
- 반대로 다운로드는 `Blob`과 `<a download>`에 의존하므로 desktop에서는 저장 경로 선택, OS 파일 시스템 접근, 저장 완료 피드백을 위한 별도 adapter가 필요할 수 있다.
- local draft는 `localStorage`만 사용한다. desktop에서 앱 데이터 디렉터리 저장으로 옮길지, webview storage를 그대로 쓸지 정책 결정이 필요하다.

### 5. 외부 링크 처리

- 약관/튜토리얼 문서는 일반 `href`와 `target="_blank"`에 기대고 있다.
- Tauri에서는 시스템 브라우저로 열지, 새 webview를 띄울지, in-app browser를 둘지 결정해야 한다.

## 브라우저 전용 API / web-only assumption 목록

### 인증/내비게이션

- `apps/app/src/pages/login/index.tsx`
    - OAuth 복귀 URL을 런타임 app public URL에 의존
- `apps/app/src/pages/login/redirect-page.tsx`
    - `location.search`에서 access token 직접 파싱
- `apps/app/src/shared/api/client.ts`
    - 401 시 `window.location.pathname/search` 기반 refresh 이동
- `apps/app/src/features/auth/index.ts`
    - `window.history.back`, `location.replace`
- `apps/app/src/pages/refresh/index.tsx`
    - refresh 완료 후 `location.replace`

### 저장/상태 복구

- `apps/app/src/pages/make-shift/model/make-shift-store.ts`
- `apps/app/src/features/edit-duty/model/utils/prefs.ts`
- `apps/app/src/features/shift-editor/model/persistence.ts`
    - 모두 `window.localStorage` 직접 사용

### 클립보드

- `apps/app/src/pages/member/ui/ward-info.tsx`
- `apps/app/src/pages/register/ui/enter-ward.tsx`
- `apps/app/src/features/register-ward/ui/register-ward-shift-teams-section.tsx`
- `apps/app/src/features/shift-editor/model/use-shift-editor-key-bindings.ts`
    - `navigator.clipboard` 직접 사용

### 다운로드 / 파일

- `apps/app/src/features/shift-editor/model/shift-to-excel.ts`
    - 브라우저 다운로드 anchor에 의존
- `apps/app/src/features/file/model/upload-file.ts`
- `apps/app/src/shared/api/file/index.ts`
    - web `File`, `FormData`, presigned URL 업로드에 의존

### DOM 직접 제어

- 튜토리얼, 모달, 키보드 핸들링 관련 다수 파일에서 `document.getElementById`, `createPortal`, `document.addEventListener` 사용
- 이 부분은 Tauri에서 즉시 막히진 않지만, webview 외 환경 공유를 전제로 하면 adapter 여지가 적다.

## 인증/redirect/도메인 점검 포인트

- desktop 복귀 URL 정책 결정
    - 후보: 고정 https origin 유지, custom scheme deep link, loopback local server
- 백엔드 OAuth redirect whitelist에 desktop 복귀 주소를 어떻게 추가할지 정리
- refresh cookie의 `SameSite`, `Secure`, `Domain`이 Tauri webview에서 유지되는지 확인
- `nextPageUrl`를 외부 절대 URL이 아닌 앱 내부 path 중심으로 바꿀지 검토
- `location.replace` 기반 강제 이동을 추후 navigation adapter로 감쌀지 결정

## 파일/저장소/외부 링크 점검 포인트

- Excel 내보내기는 desktop 저장 다이얼로그 기반으로 전환할지 검토
- 업로드용 `File` 객체를 web input에서 받을지, Tauri file picker와 연결할지 결정
- `localStorage` 보존 정책을 유지할지, 앱 데이터 디렉터리(JSON/SQLite)로 옮길지 결정
- 약관/튜토리얼 등 외부 링크를 시스템 브라우저로 열기 위한 추상화 필요 여부 검토

## 이번에 반영한 소규모 정리

- `apps/app/src/shared/config/runtime.ts` 추가
    - app public URL, server URL, profile image base URL, 외부 문서 URL을 런타임 구성으로 통합
- 로그인 OAuth 시작 URL을 `buildAuthAuthorizeUrl`로 이동
- 튜토리얼/약관/개인정보 링크 하드코딩을 runtime config 참조로 변경
- 프로필 이미지 S3 base URL fallback 하드코딩을 runtime config 참조로 이동
- `vite-env.d.ts`에 desktop 대응 검토용 runtime env 타입 추가

## 선행 정리 포인트

1. 인증 이동과 외부 링크 열기를 `platform/navigation` 또는 유사 adapter로 분리
2. storage 접근을 `localStorage` 직접 호출 대신 driver 인터페이스 뒤로 숨기기
3. 다운로드 로직을 browser download와 desktop save를 나눌 수 있게 분리
4. 배포/런타임 URL을 env 기준으로 통일하고 앱 내부에서 직접 도메인을 박지 않기
5. OAuth 복귀 payload를 querystring access token 대신 더 안전한 방식으로 바꿀지 검토

## 후속 티켓 후보

- `apps/app` 인증 이동 로직을 platform adapter로 분리
- localStorage 사용 지점을 storage driver로 추상화
- shift excel export에 desktop 저장 adapter 도입
- 외부 링크 열기 정책 정리 및 helper 도입
- Tauri PoC에서 OAuth refresh cookie 동작 검증
