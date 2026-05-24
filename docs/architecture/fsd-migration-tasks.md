# FSD 전환 작업 목록

> 본 문서는 현재 상태를 기준으로 우선순위 작업을 정리한 체크리스트이다.

## 1. queryOptions 정비
- [x] 기존 쿼리 선언 위치 조사 및 목록화
- [x] `entities/*/queryOptions`로 이관
- [x] query key 네이밍 규칙 확정 및 문서화
- [x] 모든 `useQuery`가 queryOptions를 사용하도록 변경

## 2. model hook 정리 (useMutation 미사용 정책 반영)
- [x] API 호출을 각 model hook으로 집중
- [x] 호출 결과 반환 범위 최소화 (필요 시 콜백 패턴 적용)
- [x] side-effect를 useCase 내부에서 조합

## 3. 상태관리 구조 확정 (store/useCase)
- [x] slice별 store 책임 범위 정의
- [x] useCase는 행동만 제공하도록 규칙 정립
- [x] useCase 호출 위치(최상위 1회 호출) **실험/검증** 세션 분리

## 4. FSD 구조 재정렬
- [x] widgets 분리 대상 선정 (페이지 단위 UI)
- [x] features 분리 대상 선정 (기능 단위)
- [x] entities 정리 (도메인 데이터/모델 일원화)
- [x] shared/ui 재정렬 (공통 컴포넌트)

## 5. 레거시 대응
- [ ] 리팩터링 우선순위 매트릭스 수립
- [ ] legacy/compat 경로 정의 및 분리
- [ ] 단계별 마이그레이션 로드맵 작성
