# FSD 전환 진행 상황 정리 및 개선 방향

## 배경
- 프로젝트는 FSD(Feature-Sliced Design)로 전환 중이며 기존 구조와 혼재되어 있다.
- `entities`에 `queryOptions`를 중앙 관리하고 있으며, 이를 활용해 캐싱 효율을 높이려는 방향이다.
- `useMutation`은 사용하지 않고, API 호출은 각 model의 hook에서 직접 실행하는 정책이다.
- 현재 feature 분리, widget 분리가 충분하지 않아 개선 방향 정리가 필요하다.

## 현재 방향성 요약
### 1) 서버 상태(react-query) 운용
- `entities/*/queryOptions`에서 쿼리를 중앙 관리한다.
- 실제 데이터 조회는 각 model hook에서 `queryOptions`를 재사용해 캐싱을 일관성 있게 유지한다.
- `useMutation`은 사용하지 않고, 모든 API 호출은 model hook에서 직접 실행한다.
  - 복잡한 비즈니스 로직을 `useMutation`에 얹지 않는다.

### 2) 클라이언트 상태 운용
- 각 slice의 model에서 `store`와 `useCase` hook를 만든다.
- `store`는 슬라이스 단위의 클라이언트 상태를 관리한다.
- `useCase`는 비즈니스 로직만 제공하며 상태를 반환하지 않는다.
  - 내부에서 `store` 상태를 읽거나 `react-query`를 이용해 서버 상태를 조회할 수 있다.

## 개선이 필요한 영역
### 1) queryOptions 활용도 개선
- 기존 코드가 `queryOptions`를 직접 사용하지 않고 개별 쿼리를 선언하는 경우 정리 필요.
- 개선 방향
  - 기존 쿼리 선언을 `entities/*/queryOptions`로 이관.
  - 모든 `useQuery`는 `queryOptions`를 재사용해 키/캐싱 정책을 통일.
  - 도메인별 query key 네이밍 규칙 문서화.

### 2) model hook 정비 (useMutation 미사용 정책 반영)
- 개선 방향
  - data fetching/command 호출은 모두 model hook으로 집중.
  - API 호출 결과는 필요한 최소 수준으로 반환(혹은 콜백 제공).
  - side-effect는 useCase 내부에서 조합하되 view는 호출 방식만 알 수 있도록 단순화.

### 3) FSD 구조 정리 (feature/widget 분리)
- 개선 방향
  - 화면 단위의 응집된 UI는 `widgets`로 이동.
  - 비즈니스 기능 단위(UI + 로직)는 `features`로 분리.
  - 도메인 데이터/모델은 `entities`로 일원화.
  - 재사용 UI는 `shared/ui`로 이동.
  - 기존 `pages`는 route entry 역할만 유지하도록 정리.

### 4) 레거시 코드 혼재 해소
- 개선 방향
  - 리팩터링 기준을 명시해 우선순위 결정 (예: 신규 개발된 화면부터, 변경 빈도가 높은 영역부터).
  - FSD 전환 완료 전까지의 임시 위치(legacy/compat) 정립.

## 상태관리 구조 제안 (store/useCase)
### 1) store
- 목적: 슬라이스 범위의 클라이언트 상태 관리.
- 구성
  - 상태, setter, selector 제공.
  - UI에서 필요한 데이터는 slice하여 가져온다.

### 2) useCase
- 목적: 비즈니스 로직 제공.
- 특징
  - 상태를 반환하지 않고, **행동(핸들러)만 제공**.
  - 내부에서 `store` 상태를 조회하거나 `react-query`로 서버 상태를 조회 가능.

#### 사용 패턴 예시
- **store + useCase 분리 사용**
  - store는 상태만 제공하고, useCase는 핸들러만 제공한다.

```ts
// entities/schedule/model/store.ts
export const useScheduleStore = createStore((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

// entities/schedule/model/useCase.ts
export const useScheduleUseCase = () => {
  const { selectedDate } = useScheduleStore.getState();
  const { data: schedules } = useQuery(scheduleQueryOptions({ date: selectedDate }));

  const refresh = () => queryClient.invalidateQueries(scheduleQueryOptions({ date: selectedDate }).queryKey);

  return { refresh };
};
```

- **view에서 분리 사용**

```tsx
// features/Schedule/ui/ScheduleView.tsx
export const ScheduleView = () => {
  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const setSelectedDate = useScheduleStore((state) => state.setSelectedDate);
  const { refresh } = useScheduleUseCase();

  return (
    <SchedulePanel
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      onRefresh={refresh}
    />
  );
};
```

#### useCase 호출 위치 (실험 단계)
- view에서 useCase를 **최상위 1회 호출**하는 패턴은 아직 검증되지 않았다.
- 팀 합의 전까지는 **실험적 패턴**으로 취급하고, 실 서비스 적용 전 검증을 진행한다.

## 마이그레이션 전략 제안
1) `queryOptions` 통합 먼저 완료
2) model hook 정비 (useMutation 대체 로직 구축)
3) feature/widget 분리 기준 수립
4) 변경 빈도 높은 화면부터 점진적 전환
5) 남은 레거시는 legacy 영역으로 고립

## 체크 포인트
- query key 정책이 일관적으로 유지되는가?
- view에서 비즈니스 로직이 누출되지 않는가?
- useCase가 state 반환 없이 행동만 제공하는가?
- feature/widget 분리 기준이 명확한가?
