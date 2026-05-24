import {cn} from '@dutying/utils/style';
import {useEffect, useMemo, useRef, useState, type MouseEvent} from 'react';
import {createPortal} from 'react-dom';
import {type TShift, type TWardShiftType} from '@/entities';
import ShiftBadge from '@/entities/shift/ui/shift-badge';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import {type TDutyDoc, type TViolation, useShiftEditorCommands, useShiftEditorStore} from '@/features/shift-editor/model';
import {normalizeSelection} from '@/features/shift-editor/model/selection';
import {formatNurseDisplayName} from './format-nurse-display-name';

type TViolationMap = Map<string, TViolation>;

type TMakeShiftCalendarProps = {
    shift: TShift;
    doc: TDutyDoc;
    violationMap: TViolationMap;
    teamViolations?: TViolation[];
    showFaults: boolean;
    /**
     * default: 이름·이월·전달·일자·우측 행 합계·하단 일자별 통계.
     * simplified: 이름·일자만 (이월·전달 근무·합계·통계 제외) — 신청 근무 단계 등.
     */
    variant?: 'default' | 'simplified';
    /**
     * 클릭 후 부가 동작(예: 부모의 editor 영역에 focus 주기) — 선택 저장은 캘린더 내부에서 처리하므로 별도 호출 불필요.
     */
    onCellClick?: (rowIndex: number, colIndex: number) => void;
    /**
     * true면 클릭으로 셀 선택을 갱신하지 않는다 (편집 불가).
     */
    readonly?: boolean;
    /**
     * true이면 기본 (0,0) 셀 선택을 한 번 지워 /duty 등에서 초기 포커스 링을 숨긴다.
     */
    disableInitialSelection?: boolean;
};

/**
 * 근무 만들기·/duty 공용 일자 캘린더. 스케일(transform)·내부 가로 스크롤 없음, 레이아웃은 `cqw`+`@container`.
 * 열: 이름 / 이월 / 전달 / N일 / 우측 D·E·N·O·WO 합계.
 */
const VIOLATION_STYLE: Record<TViolation['level'], {border: string; background: string}> = {
    error: {border: '#FF0000', background: 'rgba(255,0,0,0.2)'},
    warning: {border: '#FFD900', background: 'rgba(238,255,0,0.3)'},
};
const VIOLATION_LEVEL_PRIORITY: Record<TViolation['level'], number> = {error: 1, warning: 0};
const NAME_COL = 'clamp(64px,4.4cqw,76px)';
const CARRY_COL = 'clamp(20px,1.5cqw,26px)';
const LAST_COL = 'clamp(74px,5.4cqw,98px)';
/**
 * 행의 좌측(카드 안에 들어가는) 그리드.
 * 사진처럼 division 카드는 이 좌측만 감싸고, 우측 합계(row-summary-counts)는
 * 카드 밖에 별도로 배치된다.
 */
const LEFT_GRID_TEMPLATE_COLUMNS = `${NAME_COL} ${CARRY_COL} ${LAST_COL} minmax(0,1fr)`;
/** 이월·전달·통계 열 없이 이름 + 일자만 */
const LEFT_GRID_TEMPLATE_COLUMNS_SIMPLIFIED = `${NAME_COL} minmax(0,1fr)`;
const ROW_GAP_X = 'clamp(4px,0.5cqw,10px)';
/**
 * division card ↔ division-summary 사이 간격.
 * 너무 좁으면 카드·합계가 붙어 보이므로 최소 여백을 둔다. (헤더·body 행·daily-summary에서 동일 값으로 정렬 유지.)
 */
const DIVISION_TO_SUMMARY_GAP = 'clamp(8px,0.65cqw,14px)';
/**
 * 우측 합계 영역(type-summary-header / row-summary / daily-summary__spacer)의 좌우 패딩.
 * 합계 열 내부는 좁게 두고, 카드와의 간격은 DIVISION_TO_SUMMARY_GAP으로 맞춘다.
 */
const SUMMARY_PADDING_X = 'clamp(0px,0.1cqw,2px)';
/**
 * type-summary-header(헤더 우측 D/E/N/O/WO 라벨) ·
 * row-summary(각 행의 합계 숫자) ·
 * daily-summary__spacer(footer spacer) 세 곳에 동시에 사용된다.
 * 사진처럼 컬럼들이 가깝게 붙도록 작은 값으로 둔다.
 */
const SUMMARY_GAP = 'clamp(2px,0.22cqw,6px)';
/**
 * 우측 합계 셀(D/E/N/O/WO 칸)의 크기.
 * - 기존: 정사각형 22px → 한~두 자리 숫자 표시에 비해 폭이 과도하게 큼.
 * - 변경: 높이는 유지(행 높이 정렬), 폭만 좁혀서 summary 컬럼 전체 폭을 줄인다.
 *   "19" 같은 2자리 숫자도 들어가야 하므로 너무 좁히면 안 됨 → clamp 하한 14px.
 *
 * type-summary-header / row-summary / daily-summary__spacer 셋 모두 동일 값을 사용해야 컬럼이 어긋나지 않는다.
 */
const SUMMARY_CELL_HEIGHT = 'h-[clamp(16px,1.4cqw,22px)]';
const SUMMARY_CELL_WIDTH = 'w-[clamp(14px,1.05cqw,18px)]';
/** 우측 row-summary 행 · footer daily-summary 행 공통 높이 */
const ROW_SUMMARY_HEIGHT = 'h-[clamp(28px,2.4cqw,40px)]';
/** row-summary 우측 합계 숫자 · daily-summary 일자별 셀 — 동일 글자 크기·색 */
const SUMMARY_COUNT_TEXT_CLASS = 'font-poppins text-[clamp(12px,1.02cqw,18px)] leading-none text-gray-4 tabular-nums';
/**
 * 일자 셀 내부 좌우 패딩.
 * - 최소값을 둬서 사이드바 등으로 컨테이너만 좁아졌을 때도 셀·배지 사이에 숨통이 남게 한다.
 * - 배지는 래퍼(SHIFT_BADGE_CELL_WRAP)로 가용 폭을 넘지 않게 하고, 내부는 ShiftBadge에 size-full.
 */
const DAY_CELL_PADDING_X = 'clamp(1px,0.18cqw,3px)';
const LAST_SHIFTS_GAP = 'clamp(1px,0.15cqw,3px)';
/** 위반 박스 — 네 면 동일 여백 (좌우와 같은 규칙으로 상하도 맞춤) */
const VIOLATION_INSET = 'clamp(1px,0.1cqw,2px)';
/**
 * division-card 행 래퍼·헤더·푸터 좌측에 쓰는 미세 인셋.
 * 일자 열은 카드 우측까지 칠해지므로 수평은 좌측만 인셋(paddingRight 0).
 * Y: 카드·division-summary 첫·끝에만 넣어 상하 숨통 — 행 안에서는 items-stretch로 주말 배경이 행 높이를 꽉 채움.
 */
const DIVISION_PADDING_X = 'clamp(3px,0.3cqw,6px)';
const DIVISION_PADDING_Y = '0px';
/**
 * 셀 안의 색상 배지(D/E/N/O 등) 크기.
 *
 * ⚠️ 불변 규칙: 색상 shift-badge는 어떤 viewport에서도 **정사각형**이어야 한다.
 *   - `size-` 단축을 쓰는 경우(예: SHIFT_BADGE_SUMMARY_ROW, SHIFT_BADGE_SMALL_BASE)는 width=height가 한 클래스에 묶인다.
 *   - 일자 셀은 SHIFT_BADGE_CELL_WRAP(aspect-square) + 자식 !w/h-full 로 정사각형을 만든다.
 *   - 부모가 `flex`인 경우 기본 shrink 때문에 배지가 찌그러질 수 있으므로 SMALL/라벨 계열에는 `shrink-0`을 둔다.
 *   - summary 텍스트 셀(SUMMARY_CELL_*)과 혼동하지 않도록 주의 — 그쪽은 폭만 좁힌 직사각형.
 *
 * 사용처 / 크기 분리:
 *   - SHIFT_BADGE_CELL_WRAP / SHIFT_BADGE_CELL_BADGE: division-card 일자 셀. 래퍼 한 변은 min(셀 폭, clamp 상한).
 *     글자만 키울 때는 CELL_BADGE의 text·leading-none만 조정(행 높이·래퍼 크기 불변).
 *   - SHIFT_BADGE_SMALL_BASE: division-card 전달 근무 4칸 — LAST_COL 안에 들어가도록 size 상한 유지, 글자는 leading-none·큰 text.
 *   - SHIFT_BADGE_SUMMARY_ROW: daily-summary__label-badge(D/E/N pill) 전용.
 */
/** footer daily-summary D/E/N pill — row-summary 숫자 셀(SUMMARY_CELL_*)과 동일 스케일, 행 안에서 중앙 정렬 */
const SHIFT_BADGE_SUMMARY_ROW =
    'shrink-0 size-[clamp(16px,1.4cqw,22px)] text-[clamp(10px,0.82cqw,14px)] leading-none rounded-[clamp(3px,0.35cqw,6px)]';
/** 일자 그리드 셀 래퍼: 한 변 = min(셀 안쪽 폭, cqw 기반 clamp 상한). */
/** violation 오버레이(z-[5]~[8])보다 위 — 배지 배경색이 위반 하이라이트에 가리지 않도록 */
const SHIFT_BADGE_CELL_WRAP =
    'make-shift-calendar__shift-badge-wrap relative z-[20] flex size-[clamp(16px,1.45vw,26px)] min-w-0 shrink-0 items-center justify-center';
const SHIFT_BADGE_CELL_BADGE =
    'make-shift-calendar__shift-badge relative z-[20] !h-full !w-full min-h-0 min-w-0 rounded-[.375rem] text-[clamp(9px,0.82vw,18px)] leading-none';
/**
 * 전달 근무 컬럼(LAST_COL)에 4개가 동시에 들어가는 좁은 영역용 배지.
 * 큰 화면에서도 LAST_COL을 넘지 않도록 max를 22px로 제한.
 * `shrink-0`로 정사각형 불변 유지(폭 부족 시 overflow-hidden 컨테이너에서 잘리는 편이 낫다).
 */
const SHIFT_BADGE_SMALL_BASE =
    'shrink-0 size-[clamp(14px,1.2cqw,22px)] text-[clamp(10px,0.92cqw,15px)] leading-none rounded-[clamp(3px,0.35cqw,6px)]';
/**
 * footer daily-summary 행 높이 — 배지·숫자 셀(SUMMARY_CELL_HEIGHT)에 맞춤.
 * row-summary 본문 행(28–40px)과 달리 footer는 콤팩트하게 두고,
 * D/E/N 행 사이 세로 간격만 SUMMARY_GAP(우측 합계 열 가로 gap)으로 맞춘다.
 */
const DAILY_SUMMARY_ROW_HEIGHT = SUMMARY_CELL_HEIGHT;
/**
 * 이월 박스의 round.
 */
const CARRY_ROUNDED = 'rounded-[clamp(3px,0.35cqw,6px)]';

function getDaysAreaInsetLeft(simplified: boolean): string {
    if (simplified) {
        return `calc(${DIVISION_PADDING_X} + ${NAME_COL} + ${ROW_GAP_X})`;
    }

    return `calc(${DIVISION_PADDING_X} + ${NAME_COL} + ${ROW_GAP_X} + ${CARRY_COL} + ${ROW_GAP_X} + ${LAST_COL} + ${ROW_GAP_X})`;
}

function getViolationColSpan(violation: TViolation): {startCol: number; span: number} {
    const cols = violation.cells.map((cell) => cell.col);
    const startCol = Math.min(...cols);
    const endCol = Math.max(...cols);

    return {startCol, span: endCol - startCol + 1};
}

type TDivisionTeamViolationOverlayProps = {
    violations: TViolation[];
    dayCount: number;
    rowCount: number;
    simplified: boolean;
};

function DivisionTeamViolationOverlay({violations, dayCount, rowCount, simplified}: TDivisionTeamViolationOverlayProps) {
    if (violations.length === 0 || rowCount === 0) return null;

    return (
        <div
            className="make-shift-calendar__team-violations pointer-events-none absolute right-0 z-[4] grid"
            style={{
                left: getDaysAreaInsetLeft(simplified),
                top: 0,
                bottom: 0,
                paddingTop: DIVISION_PADDING_Y,
                paddingBottom: DIVISION_PADDING_Y,
                gridTemplateColumns: `repeat(${dayCount}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rowCount}, clamp(28px, 2.4cqw, 40px))`,
            }}
        >
            {violations.map((violation) => {
                const {startCol, span} = getViolationColSpan(violation);
                const style = VIOLATION_STYLE[violation.level];

                return (
                    <span
                        key={violation.ruleId}
                        aria-label={violation.message}
                        title={violation.message}
                        data-violation-level={violation.level}
                        data-violation-scope="team"
                        style={{
                            gridColumn: `${startCol + 1} / span ${span}`,
                            gridRow: '1 / -1',
                            borderColor: style.border,
                            backgroundColor: style.background,
                            margin: VIOLATION_INSET,
                        }}
                        className={cn(
                            'make-shift-calendar__violation',
                            `make-shift-calendar__violation--${violation.level}`,
                            'make-shift-calendar__violation--team',
                            'rounded-[clamp(5px,0.55cqw,8px)] border-[1.5px]',
                            violation.level === 'error' ? 'z-[6]' : 'z-[5]',
                        )}
                    />
                );
            })}
        </div>
    );
}

export function MakeShiftCalendar({
    shift,
    doc,
    violationMap,
    teamViolations = [],
    showFaults,
    variant = 'default',
    onCellClick,
    readonly = false,
    disableInitialSelection = false,
}: TMakeShiftCalendarProps) {
    const {separateWeekendColor} = useUIConfigStore();
    const commands = useShiftEditorCommands();
    const selection = useShiftEditorStore((s) => s.selection);
    const selectionRect = useMemo(() => (selection ? normalizeSelection(selection) : null), [selection]);
    const didClearInitialSelection = useRef(false);

    useEffect(() => {
        if (!disableInitialSelection || didClearInitialSelection.current) return;

        if (selection?.type === 'single' && selection.anchor.row === 0 && selection.anchor.col === 0) {
            commands.clearSelection();
            didClearInitialSelection.current = true;
        }
    }, [commands, disableInitialSelection, selection]);

    /**
     * 셀 클릭 처리.
     * - readonly가 아니면 store selection을 갱신해서 키보드 입력이 해당 셀에 반영되도록 한다.
     * - 부모의 onCellClick은 부가 동작(주로 editor 영역 focus)으로만 사용된다.
     */
    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (!readonly) {
            commands.select({row: rowIndex, col: colIndex});
        }

        onCellClick?.(rowIndex, colIndex);
    };
    const shortNameToType = useMemo(() => {
        const map = new Map<string, TWardShiftType>();

        for (const t of shift.wardShiftTypes) map.set(t.shortName, t);

        return map;
    }, [shift.wardShiftTypes]);
    const idToType = useMemo(() => {
        const map = new Map<number, TWardShiftType>();

        for (const t of shift.wardShiftTypes) map.set(t.wardShiftTypeId, t);

        return map;
    }, [shift.wardShiftTypes]);
    const workerRowMap = useMemo(() => {
        const map = new Map<string, {row: TDutyDoc['rows'][number]; index: number}>();

        doc.rows.forEach((row, index) => map.set(row.workerId, {row, index}));

        return map;
    }, [doc]);
    const summaryShiftTypes = useMemo(() => {
        const usedTypeIds = new Set<number>();

        for (const row of doc.rows) {
            for (const cell of row.cells) {
                if (!cell) continue;

                const type = shortNameToType.get(cell);

                if (type?.isCounted) {
                    usedTypeIds.add(type.wardShiftTypeId);
                }
            }
        }

        return shift.wardShiftTypes.filter((type) => type.isCounted && usedTypeIds.has(type.wardShiftTypeId));
    }, [doc.rows, shift.wardShiftTypes, shortNameToType]);
    const hasSummaryShiftTypes = summaryShiftTypes.length > 0;
    const isSimplified = variant === 'simplified';
    const leftGridTemplateColumns = isSimplified ? LEFT_GRID_TEMPLATE_COLUMNS_SIMPLIFIED : LEFT_GRID_TEMPLATE_COLUMNS;

    return (
        <div
            // 캘린더는 가용 폭을 항상 100% 사용한다.
            // - 화면 폭이 줄면: 캘린더도 같이 줄어 우측 여백이 자연스럽게 함께 줄어든다.
            // - 화면 폭이 page-min(1280px) 미만이면: page-view가 페이지 전체 가로 스크롤로 처리.
            // 캘린더 자체는 절대 가로 스크롤을 갖지 않는다 (no overflow-x-*).
            //
            // 행 단위 구조:
            //   <row>
            //     <row-left>  (이름·이월·전달근무·일자) — division 카드 내부에 들어감
            //     <row-summary>(D/E/N/O/WO 합계) — 카드 밖, 우측에 분리 배치
            //   </row>
            className="make-shift-calendar @container flex w-full min-w-0 flex-col gap-2"
        >
            {/* HEADER */}
            <div
                className="make-shift-calendar__header flex w-full min-w-0 items-center py-1"
                style={{gap: isSimplified || !hasSummaryShiftTypes ? 0 : DIVISION_TO_SUMMARY_GAP}}
            >
                <div
                    className="make-shift-calendar__header-left grid min-w-0 flex-1 items-center"
                    // body와 동일: 좌측만 DIVISION_PADDING_X, 일자 영역은 우측까지.
                    style={{
                        gridTemplateColumns: leftGridTemplateColumns,
                        columnGap: ROW_GAP_X,
                        paddingLeft: DIVISION_PADDING_X,
                        paddingRight: 0,
                    }}
                >
                    <HeaderLabel className="make-shift-calendar__header-label--name">이름</HeaderLabel>
                    {!isSimplified && (
                        <>
                            <HeaderLabel className="make-shift-calendar__header-label--carry">이월</HeaderLabel>
                            <HeaderLabel className="make-shift-calendar__header-label--last">전달 근무</HeaderLabel>
                        </>
                    )}

                    <div
                        className="make-shift-calendar__day-header-pill grid min-w-0 rounded-[12px] bg-gray-7 px-1.5 py-1"
                        style={{gridTemplateColumns: `repeat(${shift.days.length}, minmax(0, 1fr))`}}
                    >
                        {shift.days.map((d, j) => (
                            <p
                                key={j}
                                className={cn(
                                    'make-shift-calendar__day-header-cell',
                                    'min-w-0 rounded-full text-center font-poppins tabular-nums',
                                    'text-[12px] leading-5 font-semibold',
                                    d.dayType === 'saturday'
                                        ? separateWeekendColor
                                            ? 'text-blue'
                                            : 'text-red'
                                        : d.dayType === 'sunday' || d.dayType === 'holiday'
                                          ? 'text-red'
                                          : 'text-sub-2.5',
                                )}
                            >
                                {d.day}
                            </p>
                        ))}
                    </div>
                </div>

                {!isSimplified && hasSummaryShiftTypes && (
                    /*
                     * 사진 기준: 헤더 우측 D/E/N/O/WO 라벨은 박스 없이
                     * 모두 동일한 회색의 "컬럼 헤더" 텍스트 라벨이다.
                     * (footer의 daily-summary 배지와는 정반대 — 그쪽은 배경 채움.)
                     */
                    <div
                        className="make-shift-calendar__type-summary-header flex shrink-0 items-center"
                        style={{gap: SUMMARY_GAP, paddingInline: SUMMARY_PADDING_X}}
                    >
                        {summaryShiftTypes.map((type) => (
                            <div
                                key={type.wardShiftTypeId}
                                className={cn(
                                    'make-shift-calendar__type-summary-badge',
                                    'grid place-items-center font-poppins text-[clamp(10px,0.82cqw,14px)] leading-none font-medium',
                                    SUMMARY_CELL_HEIGHT,
                                    SUMMARY_CELL_WIDTH,
                                )}
                                style={{color: type.color}}
                            >
                                {type.shortName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* BODY: division-level별로 카드 + 우측 합계가 나란히 배치 */}
            <div className="make-shift-calendar__body flex w-full min-w-0 flex-col gap-2">
                {shift.divisionShiftNurses.map((division, level) => {
                    const rows = division.filter((r) => r.shiftNurse.isWorker);

                    if (rows.length === 0) return null;

                    return (
                        <div
                            key={level}
                            data-division-level={level}
                            className="make-shift-calendar__division flex w-full min-w-0 items-stretch"
                            style={{gap: isSimplified || !hasSummaryShiftTypes ? 0 : DIVISION_TO_SUMMARY_GAP}}
                        >
                            {/*
                             * 카드 상·하만 DIVISION_PADDING_Y(첫·끝 행 래퍼). 좌는 이름 열만 인셋, 일자는 우측까지.
                             * 행 그리드는 items-stretch → 주말 셀이 행 높이 전체를 칠함(행 안에서 잘리지 않음).
                             */}
                            <div className="make-shift-calendar__division-card relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] bg-white">
                                {showFaults && teamViolations.length > 0 && (
                                    <DivisionTeamViolationOverlay
                                        violations={teamViolations}
                                        dayCount={shift.days.length}
                                        rowCount={rows.length}
                                        simplified={isSimplified}
                                    />
                                )}
                                {rows.map((row, i) => {
                                    const workerId = String(row.shiftNurse.shiftNurseId);
                                    const docEntry = workerRowMap.get(workerId);

                                    if (!docEntry) return null;

                                    return (
                                        <div
                                            key={row.shiftNurse.shiftNurseId}
                                            style={{
                                                paddingLeft: DIVISION_PADDING_X,
                                                paddingRight: 0,
                                                paddingTop: i === 0 ? DIVISION_PADDING_Y : 0,
                                                paddingBottom: i === rows.length - 1 ? DIVISION_PADDING_Y : 0,
                                            }}
                                        >
                                            <CalendarRowLeft
                                                nurseName={row.shiftNurse.name}
                                                carried={row.shiftNurse.carried}
                                                lastShifts={row.lastWardShiftList.map((id) =>
                                                    id != null ? (idToType.get(id) ?? null) : null,
                                                )}
                                                days={shift.days}
                                                cells={docEntry.row.cells}
                                                rowIndex={docEntry.index}
                                                shiftNurseId={row.shiftNurse.shiftNurseId}
                                                shortNameToType={shortNameToType}
                                                idToType={idToType}
                                                wardReqShiftList={row.wardReqShiftList}
                                                violations={violationMap}
                                                showFaults={showFaults}
                                                separateWeekendColor={separateWeekendColor}
                                                simplified={isSimplified}
                                                readonly={readonly}
                                                selectionRect={selectionRect}
                                                onCellClick={handleCellClick}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {!isSimplified && hasSummaryShiftTypes && (
                                /* 우측 합계: 카드와 동일 DIVISION_PADDING_Y로 세로 정렬 */
                                <div
                                    className="make-shift-calendar__division-summary flex shrink-0 flex-col"
                                    style={{paddingBlock: DIVISION_PADDING_Y}}
                                >
                                    {rows.map((row) => {
                                        const workerId = String(row.shiftNurse.shiftNurseId);
                                        const docEntry = workerRowMap.get(workerId);

                                        if (!docEntry) return null;

                                        return (
                                            <CalendarRowSummary
                                                key={row.shiftNurse.shiftNurseId}
                                                cells={docEntry.row.cells}
                                                days={shift.days}
                                                shortNameToType={shortNameToType}
                                                summaryShiftTypes={summaryShiftTypes}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* FOOTER: 일자별 D / E / N 합계 — simplified 에서는 생략 */}
            {!isSimplified && hasSummaryShiftTypes && (
                <DailySummary doc={doc} shortNameToType={shortNameToType} summaryShiftTypes={summaryShiftTypes} />
            )}
        </div>
    );
}

function HeaderLabel({children, className}: {children: React.ReactNode; className?: string}) {
    return (
        <div
            className={cn(
                'make-shift-calendar__header-label',
                'min-w-0 truncate text-center font-apple text-[clamp(10px,0.78cqw,14px)] font-medium text-sub-3',
                className,
            )}
        >
            {children}
        </div>
    );
}

type TCalendarRowLeftProps = {
    nurseName: string;
    carried: number;
    lastShifts: (TWardShiftType | null)[];
    days: TShift['days'];
    cells: TDutyDoc['rows'][number]['cells'];
    rowIndex: number;
    shiftNurseId: number;
    shortNameToType: Map<string, TWardShiftType>;
    idToType: Map<number, TWardShiftType>;
    wardReqShiftList: (number | null)[];
    violations: TViolationMap;
    showFaults: boolean;
    separateWeekendColor: boolean;
    simplified: boolean;
    readonly: boolean;
    selectionRect: {top: number; left: number; bottom: number; right: number} | null;
    onCellClick?: (rowIndex: number, colIndex: number) => void;
};

/**
 * 행의 좌측 (이름·이월·전달근무·일자) — division 카드 안에 들어간다.
 */
function CalendarRowLeft({
    nurseName,
    carried,
    lastShifts,
    days,
    cells,
    rowIndex,
    shiftNurseId,
    shortNameToType,
    idToType,
    wardReqShiftList,
    violations,
    showFaults,
    separateWeekendColor,
    simplified,
    readonly,
    selectionRect,
    onCellClick,
}: TCalendarRowLeftProps) {
    const [violationTip, setViolationTip] = useState<{message: string; left: number; top: number} | null>(null);
    const [hoveredViolationKey, setHoveredViolationKey] = useState<string | null>(null);
    const rowViolationPrefix = `${shiftNurseId},`;
    const violationsByDayCol = useMemo(() => {
        const byCol = new Map<number, TViolation[]>();

        for (const [key, v] of violations) {
            if (!key.startsWith(rowViolationPrefix)) continue;

            for (const c of v.cells) {
                if (c.row !== rowIndex) continue;

                const list = byCol.get(c.col) ?? [];

                list.push(v);
                byCol.set(c.col, list);
            }
        }

        return byCol;
    }, [violations, rowIndex, rowViolationPrefix]);
    const violationSpanList = useMemo(() => {
        const list: {startCol: number; violation: TViolation}[] = [];

        for (const [key, v] of violations) {
            if (!key.startsWith(rowViolationPrefix)) continue;

            const startCol = v.cells[0]?.col;

            if (startCol === undefined) continue;

            list.push({startCol, violation: v});
        }

        list.sort((a, b) => {
            const p = VIOLATION_LEVEL_PRIORITY[a.violation.level] - VIOLATION_LEVEL_PRIORITY[b.violation.level];

            if (p !== 0) return p;

            return a.startCol - b.startCol;
        });

        return list;
    }, [rowViolationPrefix, violations]);
    const violationTipMessage = (items: TViolation[] | undefined) => items?.map((v) => v.message).join('\n\n');
    const primaryViolation = (items: TViolation[] | undefined) => {
        if (!items || items.length === 0) return undefined;

        return [...items].sort((a, b) => VIOLATION_LEVEL_PRIORITY[b.level] - VIOLATION_LEVEL_PRIORITY[a.level])[0];
    };
    const showViolationTipFromTarget = (target: HTMLButtonElement, v: TViolation) => {
        const r = target.getBoundingClientRect();

        setViolationTip({message: v.message, left: r.left + r.width / 2, top: r.bottom + 6});
    };
    const onViolationTipPointer = (e: MouseEvent<HTMLButtonElement>, v: TViolation | undefined) => {
        if (!showFaults || !v) return;

        showViolationTipFromTarget(e.currentTarget, v);
        setHoveredViolationKey(`${shiftNurseId},${v.cells[0]!.col},${v.ruleId}`);
    };
    const getCellShiftType = (j: number): TWardShiftType | null => {
        const cell = cells[j];

        if (!cell) return null;

        return shortNameToType.get(cell) ?? null;
    };

    return (
        <>
            <div
                data-shift-nurse-id={shiftNurseId}
                data-row-index={rowIndex}
                className="make-shift-calendar__row make-shift-calendar__row-left grid h-[clamp(28px,2.4cqw,40px)] w-full min-w-0 items-stretch"
                style={{
                    gridTemplateColumns: simplified ? LEFT_GRID_TEMPLATE_COLUMNS_SIMPLIFIED : LEFT_GRID_TEMPLATE_COLUMNS,
                    columnGap: ROW_GAP_X,
                }}
            >
                <div
                    className="make-shift-calendar__row-name flex min-h-0 min-w-0 items-center justify-center truncate text-center font-apple text-[clamp(12px,1.05cqw,16px)] leading-none whitespace-nowrap text-sub-1"
                    title={nurseName}
                >
                    {formatNurseDisplayName(nurseName)}
                </div>

                {!simplified && (
                    <>
                        <div className="make-shift-calendar__row-carry flex min-h-0 items-center justify-center">
                            <div
                                className={cn(
                                    'make-shift-calendar__row-carry-value',
                                    'grid size-[clamp(20px,1.8cqw,28px)] place-items-center bg-main-bg font-poppins text-[clamp(12px,1.05cqw,16px)] leading-none text-sub-2 tabular-nums',
                                    CARRY_ROUNDED,
                                )}
                            >
                                {carried}
                            </div>
                        </div>

                        <div
                            className="make-shift-calendar__row-last-shifts flex min-h-0 min-w-0 flex-nowrap items-center justify-center overflow-hidden"
                            style={{gap: LAST_SHIFTS_GAP}}
                        >
                            {lastShifts.map((t, i) => (
                                <ShiftBadge
                                    key={i}
                                    shiftType={t}
                                    className={cn('make-shift-calendar__row-last-shift-badge', SHIFT_BADGE_SMALL_BASE)}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div
                    className="make-shift-calendar__row-days grid h-full min-w-0 items-stretch px-0"
                    style={{gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`}}
                >
                    {days.map((day, j) => {
                        const shiftType = getCellShiftType(j);
                        const reqId = wardReqShiftList[j] ?? null;
                        const reqType = reqId != null ? idToType.get(reqId) : null;
                        const cellViolationList = showFaults ? violationsByDayCol.get(j) : undefined;
                        const cellViolation = primaryViolation(cellViolationList);
                        const cellViolationTitle = violationTipMessage(cellViolationList);
                        const weekendBg =
                            day.dayType === 'saturday'
                                ? separateWeekendColor
                                    ? 'bg-blue/5'
                                    : 'bg-red/5'
                                : day.dayType === 'sunday' || day.dayType === 'holiday'
                                  ? 'bg-red/5'
                                  : '';
                        const isSelected =
                            !readonly &&
                            selectionRect !== null &&
                            rowIndex >= selectionRect.top &&
                            rowIndex <= selectionRect.bottom &&
                            j >= selectionRect.left &&
                            j <= selectionRect.right;

                        return (
                            <button
                                key={j}
                                type="button"
                                tabIndex={-1}
                                data-day-index={j}
                                data-selected={isSelected || undefined}
                                data-violation-rule={cellViolation?.ruleId}
                                onClick={() => onCellClick?.(rowIndex, j)}
                                onMouseEnter={(e) => {
                                    if (!cellViolation) {
                                        setHoveredViolationKey(null);

                                        return;
                                    }

                                    onViolationTipPointer(e, {
                                        ...cellViolation,
                                        message: cellViolationTitle ?? cellViolation.message,
                                    });
                                }}
                                onMouseLeave={() => {
                                    setViolationTip(null);
                                    setHoveredViolationKey(null);
                                }}
                                onFocus={(e) => {
                                    if (!showFaults || !cellViolation) return;

                                    showViolationTipFromTarget(e.currentTarget, {
                                        ...cellViolation,
                                        message: cellViolationTitle ?? cellViolation.message,
                                    });

                                    if (cellViolation) {
                                        setHoveredViolationKey(`${shiftNurseId},${cellViolation.cells[0]!.col},${cellViolation.ruleId}`);
                                    }
                                }}
                                onBlur={() => {
                                    setViolationTip(null);
                                    setHoveredViolationKey(null);
                                }}
                                title={cellViolationTitle}
                                style={{gridRow: 1, gridColumn: j + 1, paddingInline: DAY_CELL_PADDING_X}}
                                className={cn(
                                    'make-shift-calendar__day-cell',
                                    'group relative z-[10] flex h-full min-w-0 items-center justify-center',
                                    cellViolation ? 'cursor-help' : readonly ? 'cursor-default' : 'cursor-pointer',
                                    weekendBg,
                                )}
                            >
                                {reqType && shiftType && reqType.wardShiftTypeId !== shiftType.wardShiftTypeId && (
                                    <span
                                        className="make-shift-calendar__request-outline pointer-events-none absolute inset-[clamp(1px,0.18cqw,3px)] rounded-[clamp(4px,0.5cqw,7px)] border-[1.5px] opacity-70"
                                        style={{borderColor: reqType.color}}
                                        aria-hidden
                                    />
                                )}
                                <span className={SHIFT_BADGE_CELL_WRAP}>
                                    <ShiftBadge
                                        shiftType={shiftType}
                                        isOnlyRequest={shiftType === null && reqType !== null}
                                        className={cn(SHIFT_BADGE_CELL_BADGE, isSelected && 'outline outline-2 outline-main-1')}
                                    />
                                </span>
                            </button>
                        );
                    })}
                    {showFaults &&
                        violationSpanList.map(({startCol, violation: v}) => {
                            const span = Math.max(1, v.cells.length);
                            const style = VIOLATION_STYLE[v.level];
                            const vioKey = `${shiftNurseId},${startCol},${v.ruleId}`;
                            const isHovered = hoveredViolationKey === vioKey;
                            const zByLevel = v.level === 'error' ? 'z-[6]' : 'z-[5]';

                            return (
                                <span
                                    key={`vio-${v.ruleId}-${startCol}`}
                                    aria-label={v.message}
                                    title={v.message}
                                    data-violation-level={v.level}
                                    style={{
                                        gridRow: 1,
                                        gridColumn: `${startCol + 1} / span ${span}`,
                                        borderColor: style.border,
                                        backgroundColor: style.background,
                                        margin: VIOLATION_INSET,
                                        transformOrigin: 'center',
                                        transform: isHovered ? 'scale(1.085)' : undefined,
                                        transition: 'transform 140ms ease-out',
                                    }}
                                    className={cn(
                                        'make-shift-calendar__violation',
                                        `make-shift-calendar__violation--${v.level}`,
                                        'pointer-events-none rounded-[clamp(5px,0.55cqw,8px)] border-[1.5px]',
                                        zByLevel,
                                        isHovered && 'z-[8]',
                                    )}
                                />
                            );
                        })}
                </div>
            </div>
            {violationTip != null &&
                createPortal(
                    <div
                        role="tooltip"
                        className="pointer-events-none fixed z-[99999] box-border w-max max-w-[min(24rem,calc(100vw-1rem))] -translate-x-1/2 rounded-md bg-white px-2.5 py-1.5 text-left font-apple text-xs leading-snug whitespace-normal text-sub-1"
                        style={{left: violationTip.left, top: violationTip.top}}
                    >
                        {violationTip.message}
                    </div>,
                    document.body,
                )}
        </>
    );
}

type TCalendarRowSummaryProps = {
    cells: TDutyDoc['rows'][number]['cells'];
    days: TShift['days'];
    shortNameToType: Map<string, TWardShiftType>;
    summaryShiftTypes: TWardShiftType[];
};

/**
 * 행의 우측 합계 (D/E/N/O/WO) — division 카드 밖에 분리되어 배치된다.
 * 좌측 행과 동일한 height로 vertically 정렬된다.
 */
function CalendarRowSummary({cells, days, shortNameToType, summaryShiftTypes}: TCalendarRowSummaryProps) {
    const countByType = (typeId: number) =>
        cells.filter((cell, j) => {
            const t = cell ? shortNameToType.get(cell) : null;
            const day = days[j];

            if (t?.wardShiftTypeId !== typeId) return false;

            return day != null;
        }).length;

    return (
        <div
            className={cn('make-shift-calendar__row-summary flex shrink-0 items-center', ROW_SUMMARY_HEIGHT)}
            style={{gap: SUMMARY_GAP, paddingInline: SUMMARY_PADDING_X}}
        >
            {summaryShiftTypes.map((t) => (
                <div
                    key={t.wardShiftTypeId}
                    className={cn(
                        'make-shift-calendar__row-summary-count',
                        'grid place-items-center',
                        SUMMARY_COUNT_TEXT_CLASS,
                        SUMMARY_CELL_HEIGHT,
                        SUMMARY_CELL_WIDTH,
                    )}
                    style={{color: t.color}}
                >
                    {countByType(t.wardShiftTypeId)}
                </div>
            ))}
        </div>
    );
}

function DailySummary({
    doc,
    shortNameToType,
    summaryShiftTypes,
}: {
    doc: TDutyDoc;
    shortNameToType: Map<string, TWardShiftType>;
    summaryShiftTypes: TWardShiftType[];
}) {
    const countByDay = (j: number, typeId: number) =>
        doc.rows.filter((row) => {
            const cell = row.cells[j] ?? null;

            if (!cell) return false;

            return shortNameToType.get(cell)?.wardShiftTypeId === typeId;
        }).length;

    return (
        <div
            className="make-shift-daily-summary mt-[clamp(4px,0.35cqw,8px)] flex w-full min-w-0 items-stretch"
            style={{gap: DIVISION_TO_SUMMARY_GAP}}
        >
            <div
                className="make-shift-daily-summary__rows flex min-w-0 flex-1 flex-col"
                style={{paddingLeft: DIVISION_PADDING_X, paddingRight: 0, gap: SUMMARY_GAP}}
            >
                {summaryShiftTypes.map((type) => (
                    <div
                        key={type.wardShiftTypeId}
                        data-shift-type-id={type.wardShiftTypeId}
                        className={cn('make-shift-daily-summary__row grid w-full min-w-0 items-center', DAILY_SUMMARY_ROW_HEIGHT)}
                        style={{gridTemplateColumns: LEFT_GRID_TEMPLATE_COLUMNS, columnGap: ROW_GAP_X}}
                    >
                        <div />
                        <div />
                        <div className="make-shift-daily-summary__label flex items-center justify-end">
                            <div
                                className={cn(
                                    'make-shift-daily-summary__label-badge',
                                    'grid place-items-center font-poppins font-semibold',
                                    SHIFT_BADGE_SUMMARY_ROW,
                                )}
                                style={{color: type.color}}
                            >
                                {type.shortName}
                            </div>
                        </div>
                        <div
                            className="make-shift-daily-summary__cells grid h-full min-w-0 items-center px-0"
                            style={{gridTemplateColumns: `repeat(${doc.columns.length}, minmax(0, 1fr))`}}
                        >
                            {doc.columns.map((_d, j) => (
                                <div
                                    key={j}
                                    data-day-index={j}
                                    className={cn(
                                        'make-shift-daily-summary__cell grid h-full min-w-0 place-items-center',
                                        SUMMARY_COUNT_TEXT_CLASS,
                                    )}
                                    style={{color: type.color}}
                                >
                                    {countByDay(j, type.wardShiftTypeId)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <DailySummarySpacer count={summaryShiftTypes.length} />
        </div>
    );
}

/**
 * DailySummary의 우측 폭을 body의 row-summary 폭과 정확히 맞추는 spacer.
 * 보이지는 않지만 row-summary와 동일한 size의 placeholder를 그려서
 * 좌측 영역(carrier-card)의 width가 body division-card와 1px도 어긋나지 않도록 한다.
 *
 * row-summary는 counted + off를 모두 표시하므로 spacer도 동일 폭을 갖는다.
 * (daily-summary 본문은 off를 표시하지 않지만 spacer는 정렬용이라 포함해야 함.)
 */
function DailySummarySpacer({count}: {count: number}) {
    return (
        <div
            className="make-shift-daily-summary__spacer flex shrink-0 items-center"
            style={{gap: SUMMARY_GAP, paddingInline: SUMMARY_PADDING_X}}
            aria-hidden
        >
            {Array.from({length: count}).map((_, i) => (
                <div key={i} className={cn(SUMMARY_CELL_HEIGHT, SUMMARY_CELL_WIDTH)} />
            ))}
        </div>
    );
}
