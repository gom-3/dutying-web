# .net 웹 종료 — 2026-11-01

사용자 요청에 따라 기존 React 애플리케이션의 제공과 빌드를 종료하고, Vercel에서 정적 종료 파일과 소규모 리디렉션 함수만 제공한다. install/build 명령은 비어 있고 출력 디렉터리는 retired다.

- 홈페이지와 index.html → https://www.dutying.ai/ (308)
- terms/privacy → 대응 .ai 공개 문서 (308)
- 기존 서비스의 로그인·가입·근무표 진입 → .ai/login (308). 구 서비스의 병동/근무표 ID는 호환되지 않으므로 전달하지 않는다.
- OAuth 콜백, JS 번들, 삭제된 페이지 및 나머지 경로 → 410 + 새 주소 안내. 임의의 삭제 URL을 홈페이지로 보내지 않는다.
- 리디렉션 함수에서 허용된 고정 URL로만 Location을 반환해 구 URL의 토큰·쿼리를 새 서비스로 복사하지 않는다.
- robots.txt는 구 URL의 이동/종료 응답을 크롤러가 읽도록 허용한다. sitemap.xml은 새 사이트맵으로 이동한다.

이 설정은 배포된 프로젝트의 도메인에만 적용된다. Vercel에서 실제 .net 도메인 소유 프로젝트와 Git 저장소/production branch를 확인한 뒤 배포하고, www/apex/dev/test/webview/app 각각 외부 HTTP 응답을 확인해야 한다. 다른 저장소에 연결된 프로젝트에는 이 변경만으로 적용되지 않는다. .ai 도메인을 이 종료 프로젝트에 연결하지 않는다.

공유 EC2의 구 JVM 종료와 API 410 처리는 별도 운영 변경이다. 이 PR은 서버 메모리를 직접 확보하지 않는다. DB 및 Flyway migration 없음. 사용자 데이터 삭제 없음.

로컬 검증: Vercel 공식 JSON schema 검증, 라우트 매칭 및 쿼리/콜백 유출 방지 점검. 실제 Vercel 배포는 인증 복구 및 도메인 매핑 확인 후 검증한다.

Vercel preview에서 edge redirect의 고정 Location과 request/response transform만으로는 원래 쿼리 자동 추가를 막지 못했다. 따라서 영구 이동 경로만 의존성 없는 작은 Node 함수로 처리한다. React 설치/빌드는 실행하지 않고 공유 EC2 자원도 사용하지 않는다. 이 함수는 기존 Vercel 프로젝트에서 요청량에 따른 함수 사용량이 발생하며 별도 유료 플랜을 추가하지 않는다. 최종 Vercel preview의 실제 HTTP 응답 8개 사례로 쿼리 제거, 고정 목적지, POST/OAuth 콜백 410, robots 200을 확인했다. Vercel 세 프로젝트도 모두 배포 성공 상태를 확인했다.

기존 dutying-docs 프로젝트의 루트 apps/docs에도 같은 종료 구성을 제공한다. 세 프로젝트의 운영 도메인 매핑은 여전히 별도 확인이 필요하다.

종료된 React 앱의 의존성 manifest와 pnpm workspace/lock을 제거하고 Node 24의 무의존성 종료 패키지만 남긴다. 구 React 소스/테스트는 더 이상 빌드·실행하지 않으며 복구에 필요한 이력은 Git에 남아 있다. 기존 앱 기능 CI는 종료 배포 완료 시 중단해야 한다.
