# Waiting Nurse 자동 연동 요구사항 (Member > 연동관리)

## 배경
- 현재 `연동관리`에서 `수락` 시 관리자 수동 선택 플로우가 필요합니다.
- UX 개선을 위해, `수락` 클릭 시 서버가 자동 매칭을 먼저 시도하고,
  - 정확히 1건이면 즉시 연결
  - 아니면 기존 수동 플로우로 유도
  하도록 변경하려고 합니다.

## 프론트 현재 동작
- `수락` 클릭 시 프론트에서 임시 매칭 로직을 수행 중:
  - 같은 병동 내 `미연동 간호사` 대상으로
  - `이름(trim)` + `전화번호(숫자만)` 일치 시 매칭
  - 매칭 1건이면 `connect` 즉시 호출
  - 0건/2건 이상이면 기존 방식 선택 화면 진입
- 이 로직은 임시이며, 최종 기준은 백엔드가 단일 소스 오브 트루스로 가져야 합니다.

## 백엔드 구현 요청 (핵심)
`수락` 단일 액션에서 자동 매칭 판별까지 처리하는 API 제공을 요청합니다.

### 권장 엔드포인트
- `POST /wards/{wardId}/waiting-nurses/{waitingNurseId}/accept`

### 요청
- Path
  - `wardId`
  - `waitingNurseId`
- Body (옵션)
  - `shiftTeamId` (자동 매칭 실패 시 신규 추가 처리에 필요할 수 있음)
  - 또는 2단계 처리(아래 참고)

### 응답 (제안)
```json
{
  "result": "AUTO_CONNECTED | NEEDS_TEAM_SELECTION | AMBIGUOUS_MATCH | NOT_FOUND | ALREADY_PROCESSED",
  "waitingNurseId": 123,
  "matchedNurseId": 456,
  "candidateCount": 2,
  "message": "..."
}
```

## 서버 매칭 규칙 (요청)
자동 매칭 시 아래를 서버 기준으로 고정해 주세요.

1. 매칭 대상
- 같은 `wardId` 내 간호사
- `isConnected = false` 우선

2. 비교 키
- 이름: trim, 연속 공백 정리
- 전화번호: 숫자만 남긴 정규화 값 비교

3. 판정
- 1건 정확 매칭: `AUTO_CONNECTED` + 실제 연결 처리
- 0건: `NEEDS_TEAM_SELECTION`
- 2건 이상: `AMBIGUOUS_MATCH`

4. 동시성/중복 방지
- 이미 처리된 `waitingNurseId` 재요청 시 `ALREADY_PROCESSED`
- 트랜잭션/락으로 중복 연결 방지

## 예외 코드/상태 정리 요청
- `NOT_FOUND_WAITING_NURSE`
- `ALREADY_PROCESSED_WAITING_NURSE`
- `AMBIGUOUS_MATCH`
- `NO_MATCH`
- `INVALID_WARD_SCOPE`

프론트는 코드 기반으로 분기해 사용자에게 명확한 메시지를 보여줄 예정입니다.

## 처리 시나리오
1. 자동 연결 성공
- 프론트: 완료 화면(성공) 즉시 표시
- 배지/대기목록 갱신

2. 매칭 없음
- 프론트: 팀 선택 플로우로 진입 후 `approve` 진행

3. 매칭 다건
- 프론트: 간호사 선택 플로우로 진입 후 `connect` 진행

## API 단계 분리 대안 (선택)
단일 `accept`가 부담되면 아래 2단계도 가능:

1) 판별 API
- `POST /wards/{wardId}/waiting-nurses/{waitingNurseId}/match`
- 결과만 반환

2) 실행 API
- 자동 연결: `connect`
- 신규 추가: `approve`

## 감사 로그/운영 관점 요청
- 자동 연결 여부
- 매칭 근거(정규화된 이름/전화번호, 대상 nurseId)
- 처리자(accountId), 처리 시각
- 실패 사유 코드

## 프론트 연동 계획
백 응답 코드 확정 후 프론트는 아래로 전환 예정:
- 프론트의 임시 문자열 매칭 제거
- `수락` 클릭 -> 백엔드 결과 코드 기반 분기 UI

