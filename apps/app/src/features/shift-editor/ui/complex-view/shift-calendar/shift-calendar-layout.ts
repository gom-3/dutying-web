/** 이름 · 이월 · 전달 근무 · 일자(1fr) — 우측 행별 집계 열 제외 */
export const SHIFT_CALENDAR_GRID_TEMPLATE_COLUMNS_BY_DAY =
    'clamp(52px,5.5vw,68px) clamp(26px,2.4vw,32px) clamp(88px,9vw,128px) 1fr';

/** 캘린더 전체: 위 + 우측 행별 집계(auto) */
export const SHIFT_CALENDAR_GRID_TEMPLATE_COLUMNS = `${SHIFT_CALENDAR_GRID_TEMPLATE_COLUMNS_BY_DAY} auto`;

/**
 * 본문 행·일별 합계의 1~N일 그리드 공통 클래스.
 * (헤더 일자는 `border` pill이라 별도 — 본문·합계는 여기에 맞춤)
 */
export const SHIFT_CALENDAR_DAY_GRID_CLASSNAME = 'grid h-full min-h-0 min-w-0 px-2';

