import {type TWardConstraint} from '@/entities';
import type {TScheduleViolationPersisted} from './schedule-violations';

export type TCellValue = string | null;
export type TWorkKeyMap = Record<string, TCellValue>;

export type TDateKey = string; // YYYY-MM-DD

export type TDutyRuleKey =
    | 'maxContinuousWork'
    | 'minNightInterval'
    | 'maxContinuousNight'
    | 'minContinuousNight'
    | 'minOffAssignAfterNight'
    | 'excludeCertainWorkTypes'
    | 'excludeNightBeforeReqOff';

export type TDutyRow = {
    workerId: string;
    cells: TCellValue[];
};

export type TDutyDoc = {
    columns: TDateKey[];
    rows: TDutyRow[];
    workerMeta: Record<string, {name: string; nurseId?: number}>;
    fixedCells: Record<string /* `${workerId}|${date}` */, true>;
    requestCells: Record<string /* `${workerId}|${date}` */, true>;
};

export type TPersisted = {
    doc: TDutyDoc;
    history: string;
    /** 서버 validation 스냅샷 — doc·history와 함께 드래프트로 보관 */
    scheduleViolations?: TScheduleViolationPersisted;
    /** @deprecated scheduleViolations 사용 */
    llmViolations?: TViolation[];
    savedAt: number;
};

export type TCellPos = {row: number; col: number};

export type TSelection = {type: 'single'; anchor: TCellPos} | {type: 'range'; from: TCellPos; to: TCellPos};

export type TDirection = 'up' | 'down' | 'left' | 'right';

export type TTxSource = 'user' | 'ai' | 'system';

export type TSetCellsOp = {
    kind: 'setCells';
    cells: Array<{
        row: number;
        col: number;
        prev: TCellValue;
        next: TCellValue;
    }>;
    fixedDelta?: Array<{
        key: string; // `${workerId}|${date}`
        prev: boolean;
        next: boolean;
    }>;
};

export type TReorderRowsOp = {
    kind: 'reorderRows';
    prevOrder: number[];
    nextOrder: number[];
};

export type TOperation = TSetCellsOp | TReorderRowsOp;

export type TTransaction<Op> = {
    ops: Op[];
    source: TTxSource;
    timestamp: number;
};

export type TViolationScope = 'nurse' | 'team';

export type TViolation = {
    ruleId: string;
    message: string;
    cells: TCellPos[];
    level: 'warning' | 'error';
    /** team: division 일자 열 전체. nurse(기본): 해당 간호사 행만 */
    scope?: TViolationScope;
};

export type TDutyRuleLevel = TViolation['level'];

export type TDutyRuleBoardBucket = 'error' | 'warning' | 'excluded';

export type TDutyRuleBoard = Record<TDutyRuleBoardBucket, TDutyRuleKey[]>;

export type TDutyRuleLevelByKey = Partial<Record<TDutyRuleKey, TDutyRuleLevel>>;

export type TClipboardPayload = {
    width: number;
    height: number;
    cells: TCellValue[][];
};

export type THistoryEntry = {
    tx: TTransaction<TOperation>;
    inverseOps: TOperation[];
    selectionBefore?: TSelection | null;
    selectionAfter?: TSelection | null;
};

export type THistoryState = {
    past: THistoryEntry[];
    future: THistoryEntry[];
    maxDepth: number;
};

export type TValidator<Doc> = (doc: Doc) => TViolation[];

export type TDutyValidationMode = {
    /**
     * 신청 OFF 등 "요청" 정보를 함께 표기하고 싶을 때 사용.
     * - true면 해당 날짜는 'O'(대문자)로 간주되어 excludeNightBeforeReqOff 규칙이 동작한다.
     * - 제공하지 않으면(기본) 규칙은 사실상 비활성처럼 동작한다.
     */
    requestedOffByRow?: boolean[][];
};

export type TDutyValidationInput = {
    wardConstraint: TWardConstraint;
    mode?: TDutyValidationMode;
    /**
     * UI에서 "강/약"으로 분류(드래그)한 결과를 반영하기 위한 레벨 오버라이드.
     * - 지정하지 않으면 기본 rule definition의 level을 따른다.
     */
    ruleLevelByKey?: TDutyRuleLevelByKey;
};
