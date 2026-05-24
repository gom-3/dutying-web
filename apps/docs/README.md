# Dutying Docs

`apps/docs`는 별도 도메인에 독립 배포할 수 있도록 분리한 `VitePress` 기반 문서 앱이다.

## 구조

- `.vitepress/`: 사이트 설정과 테마
- `getting-started/`: 문서 사이트 소개와 진입 가이드
- `web-guide/`: 웹 사용자 여정 중심 문서
- `mobile-guide/`: 모바일 앱 가이드 확장 자리
- `troubleshooting/`: FAQ와 문제 해결

## 실행

```bash
pnpm dev:docs
pnpm build:docs
pnpm preview:docs
```
