import {
    type TDutyDoc,
    type TValidator,
    type TDutyValidationInput,
    type TViolation,
    type TCellPos,
    type TDutyRuleKey,
    type TDutyRuleLevel,
} from './types';

export type TDutyRuleDefinition = {
    key: TDutyRuleKey;
    isActive: boolean;
    regExp: RegExp;
    message: string;
    level: TViolation['level'];
};

/**
 * 예전 정규식 기반 shift 검증 로직(handlers.ts)을 DutyDoc 기반 Validator로 이식.
 * - 입력은 절대 막지 않음
 * - 위반 정보(Violation)만 계산
 */
export function createDutyValidator(input: TDutyValidationInput): TValidator<TDutyDoc> {
    const options = getDutyRuleDefinitions(input);

    return (doc) => {
        const violations: TViolation[] = [];

        for (let row = 0; row < doc.rows.length; row++) {
            const rowStr = '-' + buildRowString(doc, row, input.mode?.requestedOffByRow) + '-';

            for (const opt of options) {
                if (!opt.isActive) continue;

                // RegExp는 global이므로 row마다 lastIndex 초기화가 필요
                opt.regExp.lastIndex = 0;

                while (true) {
                    const match = opt.regExp.exec(rowStr);

                    if (!match) break;

                    const startCol = match.index - 1;
                    const endCol = startCol + match[0].length - 1;
                    const cells = rangeToCells(row, startCol, endCol, doc.columns.length);

                    if (cells.length === 0) continue;

                    violations.push({
                        ruleId: `duty.${opt.key}`,
                        message: opt.message,
                        level: opt.level,
                        cells,
                    });
                }
            }
        }

        return violations;
    };
}

export function getDutyRuleDefinitions(input: TDutyValidationInput): TDutyRuleDefinition[] {
    const c = input.wardConstraint;
    const levelByKey = input.ruleLevelByKey;

    return [
        {
            key: 'maxContinuousWork',
            isActive: c.maxContinuousWork,
            regExp: new RegExp(`[den][den]{${c.maxContinuousWorkVal - 1},}[den]`, 'g'),
            message: `근무는 연속 ${c.maxContinuousWorkVal}일을 초과할 수 없습니다.`,
            level: levelByKey?.maxContinuousWork ?? 'error',
        },
        {
            key: 'minNightInterval',
            isActive: c.minNightInterval,
            regExp: new RegExp(`n[^n]{1,${c.minNightIntervalVal - 1}}n`, 'g'),
            message: `나이트 간격이 최소 ${c.minNightIntervalVal}일 이상이어야 합니다.`,
            level: levelByKey?.minNightInterval ?? 'error',
        },
        {
            key: 'maxContinuousNight',
            isActive: c.maxContinuousNight,
            regExp: new RegExp(`n{${c.maxContinuousNightVal + 1},}`, 'g'),
            message: `나이트 근무가 연속 ${c.maxContinuousNightVal}일을 초과했습니다`,
            level: levelByKey?.maxContinuousNight ?? 'error',
        },
        {
            key: 'minContinuousNight',
            isActive: c.minContinuousNight,
            regExp: new RegExp(`[^n-]n{1,${c.minContinuousNightVal - 1}}[^n-]`, 'g'),
            message: `나이트 근무는 최소 ${c.minContinuousNightVal}일 이상 배정해야 합니다.`,
            level: levelByKey?.minContinuousNight ?? 'warning',
        },
        {
            key: 'minOffAssignAfterNight',
            isActive: c.minOffAssignAfterNight,
            regExp: new RegExp(`n([de]|o{1,${c.minOffAssignAfterNightVal - 1}}[den])`, 'g'),
            message: `나이트 근무 후 ${c.minOffAssignAfterNightVal}일 이상 OFF를 권장합니다.`,
            level: levelByKey?.minOffAssignAfterNight ?? 'warning',
        },
        {
            key: 'excludeCertainWorkTypes',
            isActive: c.excludeCertainWorkTypes,
            regExp: new RegExp(`(ed|nd|ne|nod)`, 'g'),
            message: `ND/ED/NE/NOD 형태의 근무는 권장되지 않습니다.`,
            level: levelByKey?.excludeCertainWorkTypes ?? 'warning',
        },
        {
            key: 'excludeNightBeforeReqOff',
            isActive: c.excludeNightBeforeReqOff,
            regExp: new RegExp(`nO`, 'g'),
            message: `신청 오프 전날에는 나이트 근무를 권장하지 않습니다.`,
            level: levelByKey?.excludeNightBeforeReqOff ?? 'warning',
        },
    ];
}

function buildRowString(doc: TDutyDoc, row: number, requestedOffByRow?: boolean[][]): string {
    const rowData = doc.rows[row];

    if (!rowData) return '';

    return rowData.cells
        .map((value, col) => {
            if (requestedOffByRow?.[row]?.[col] === true) return 'O';

            if (value === null) return '-';

            // 규칙은 d/e/n/o 기반이므로 1글자 기반으로 normalize
            const str = value.trim();

            if (str.length === 0) return '-';

            return str[0]!.toLowerCase();
        })
        .join('');
}

function rangeToCells(row: number, startCol: number, endCol: number, colCount: number): TCellPos[] {
    const from = Math.max(0, startCol);
    const to = Math.min(colCount - 1, endCol);

    if (to < from) return [];

    const cells: TCellPos[] = [];

    for (let col = from; col <= to; col++) {
        cells.push({row, col});
    }

    return cells;
}

/* ------------------------------------------------------------------ */
/*  Violation[] → Map 변환                                             */
/* ------------------------------------------------------------------ */

const LEVEL_PRIORITY: Record<TDutyRuleLevel, number> = {error: 1, warning: 0};

/**
 * store의 `TViolation[]`을 ShiftCalendar가 기대하는
 * `Map<string, TViolation>` (key: `${workerId},${col}`)으로 변환한다.
 *
 * ViolationLayer는 일자 그리드에서 `grid-column` span으로 그려지며, 맵은 시작 셀에만 둔다.
 * 각 violation의 **첫 번째 셀(시작 위치)**에만 엔트리를 생성한다.
 * 같은 시작 셀에 여러 violation이 겹칠 경우 severity가 높은 것(error > warning)을 우선한다.
 */
export function buildViolationMap(violations: TViolation[], doc: TDutyDoc): Map<string, TViolation> {
    const map = new Map<string, TViolation>();

    for (const v of violations) {
        const startCell = v.cells[0];

        if (!startCell) continue;

        const workerId = doc.rows[startCell.row]?.workerId;

        if (!workerId) continue;

        const key = `${workerId},${startCell.col}`;
        const existing = map.get(key);

        if (!existing || LEVEL_PRIORITY[v.level] > LEVEL_PRIORITY[existing.level]) {
            map.set(key, v);
        }
    }

    return map;
}

/**
 * 서버 validation 위반을 모두 캘린더에 표시한다.
 * key: `${workerId},${startCol},${ruleId}` — 시작 셀·ruleId 조합마다 하나씩.
 */
export function buildViolationMapAll(violations: TViolation[], doc: TDutyDoc): Map<string, TViolation> {
    const map = new Map<string, TViolation>();

    for (const v of violations) {
        if (v.scope === 'team') continue;

        const startCell = v.cells[0];

        if (!startCell) continue;

        const workerId = doc.rows[startCell.row]?.workerId;

        if (!workerId) continue;

        map.set(`${workerId},${startCell.col},${v.ruleId}`, v);
    }

    return map;
}
