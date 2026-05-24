import {groupBy} from 'lodash-es';
import type {TNurse} from '@/entities/nurse';
import {getGroupedDivisionNurses} from '@/pages/member/model/shift-team-list';

/** 계정 관리(근무팀 카드)의 division 내 priority 간격과 동일 */
export const MAKE_SHIFT_DIVISION_PRIORITY_GAP = 2024;

function sortByPriority(nurses: TNurse[]): TNurse[] {
    return [...nurses].sort((a, b) => a.priority - b.priority);
}

function sortDivisionNurses(teamNurses: TNurse[], divisionNum: number): TNurse[] {
    return sortByPriority(teamNurses.filter((n) => n.divisionNum === divisionNum));
}

/**
 * 근무 만들기 1단계: 첫 로드·팀 전환 시 화면에 보일 초기 순서 (division → priority).
 * 드래그로 순서를 바꾼 뒤에는 이 정렬을 다시 적용하지 않는다.
 */
export function sortMakeShiftWorkersInitialOrder(workers: TNurse[]): TNurse[] {
    const grouped = Object.entries(groupBy(workers, 'divisionNum')).sort((a, b) => Number.parseInt(a[0], 10) - Number.parseInt(b[0], 10));

    return grouped.flatMap(([, nurses]) => [...nurses].sort((a, b) => a.priority - b.priority));
}

function workersInDivisionDisplayOrder(displayWorkers: TNurse[], divisionNum: number): TNurse[] {
    return displayWorkers.filter((n) => n.divisionNum === divisionNum && n.isWorker);
}

/**
 * 서버에서 teamNurses가 갱신될 때, 사용자가 잡아 둔 행 순서는 유지하고 필드만 최신화한다.
 */
export function freshenMakeShiftDisplayWorkers(prevOrder: TNurse[], teamNurses: TNurse[]): TNurse[] {
    const map = new Map(teamNurses.map((n) => [n.nurseId, n]));
    const next = prevOrder.map((n) => map.get(n.nurseId)).filter((n): n is TNurse => Boolean(n));
    const ids = new Set(next.map((n) => n.nurseId));
    const additions = sortMakeShiftWorkersInitialOrder(teamNurses.filter((n) => !ids.has(n.nurseId)));

    return [...next, ...additions];
}

/**
 * division 전체 순서(근무자+비근무자)에서 근무자만 재정렬한 결과로 merged 배열 생성.
 */
function mergeWorkerOrderIntoFullOrder(fullDivOrdered: TNurse[], reorderedWorkers: TNurse[]): TNurse[] {
    const queue = [...reorderedWorkers];
    const merged: TNurse[] = [];

    for (const n of fullDivOrdered) {
        if (n.isWorker) {
            const w = queue.shift();

            if (w) merged.push(w);
        } else {
            merged.push(n);
        }
    }

    return merged;
}

/** 드래그 완료 후 화면에 유지할 근무자-only 배열 (division 순서 유지) */
export function applyMakeShiftWorkerDrag(
    displayWorkers: TNurse[],
    nurseId: number,
    srcDiv: number,
    dstDiv: number,
    srcIdx: number,
    dstIdx: number,
): TNurse[] | null {
    const srcW = workersInDivisionDisplayOrder(displayWorkers, srcDiv);

    if (srcW[srcIdx]?.nurseId !== nurseId) return null;

    const grouped = getGroupedDivisionNurses(displayWorkers);
    const byDiv = new Map(grouped.map(([div, nurses]) => [div, [...nurses]]));
    const srcKey = String(srcDiv);
    const dstKey = String(dstDiv);
    const srcList = byDiv.get(srcKey);
    const dstList = byDiv.get(dstKey);

    if (!srcList || !dstList) return null;

    const [moved] = srcList.splice(srcIdx, 1);

    if (moved?.nurseId !== nurseId) return null;

    const toInsert = srcDiv === dstDiv ? moved : {...moved, divisionNum: dstDiv};

    dstList.splice(dstIdx, 0, toInsert);

    return grouped.map(([div]) => byDiv.get(div)!).flat();
}

function finalizePayload(
    merged: TNurse[],
    midx: number,
    nurseId: number,
    shiftTeamId: number,
    divisionNum: number,
): {
    nurseId: number;
    sourceShiftTeamId: number;
    destinationShiftTeamId: number;
    divisionNum: number;
    prevPriority: number;
    nextPriority: number;
} | null {
    if (merged.length === 0) return null;

    const prevP = midx === 0 ? 0 : merged[midx - 1]!.priority;
    const nextP =
        midx === merged.length - 1
            ? merged.length === 1
                ? MAKE_SHIFT_DIVISION_PRIORITY_GAP
                : merged[midx - 1]!.priority + MAKE_SHIFT_DIVISION_PRIORITY_GAP
            : merged[midx + 1]!.priority;

    return {
        nurseId,
        sourceShiftTeamId: shiftTeamId,
        destinationShiftTeamId: shiftTeamId,
        divisionNum,
        prevPriority: prevP,
        nextPriority: nextP,
    };
}

/**
 * 근무 만들기 1단계(근무자만 표시) 드래그 결과 → `NurseAPI.updateNurseOrder` 페이로드.
 * `displayWorkers`: 화면에 나란히 보이는 근무자 순서(division 블록 순·블록 내 순).
 */
export function buildMakeShiftWorkerMovePayload(
    teamNurses: TNurse[],
    displayWorkers: TNurse[],
    shiftTeamId: number,
    nurseId: number,
    srcDiv: number,
    dstDiv: number,
    srcIdx: number,
    dstIdx: number,
): {
    nurseId: number;
    sourceShiftTeamId: number;
    destinationShiftTeamId: number;
    divisionNum: number;
    prevPriority: number;
    nextPriority: number;
} | null {
    const moving = teamNurses.find((n) => n.nurseId === nurseId);

    if (!moving?.isWorker) return null;

    if (srcDiv === dstDiv && srcIdx === dstIdx) return null;

    if (srcDiv !== dstDiv) {
        const destW = workersInDivisionDisplayOrder(displayWorkers, dstDiv);
        const srcW = workersInDivisionDisplayOrder(displayWorkers, srcDiv);

        if (srcW[srcIdx]?.nurseId !== nurseId) return null;

        const prevP = dstIdx === 0 ? 0 : destW[dstIdx - 1]!.priority;
        const nextP =
            dstIdx >= destW.length
                ? destW.length > 0
                    ? destW[destW.length - 1]!.priority + MAKE_SHIFT_DIVISION_PRIORITY_GAP
                    : MAKE_SHIFT_DIVISION_PRIORITY_GAP
                : destW[dstIdx]!.priority;

        return {
            nurseId,
            sourceShiftTeamId: shiftTeamId,
            destinationShiftTeamId: shiftTeamId,
            divisionNum: dstDiv,
            prevPriority: prevP,
            nextPriority: nextP,
        };
    }

    const workers = workersInDivisionDisplayOrder(displayWorkers, srcDiv);

    if (workers[srcIdx]?.nurseId !== nurseId) return null;

    const reordered = [...workers];
    const [removed] = reordered.splice(srcIdx, 1);

    reordered.splice(dstIdx, 0, removed!);

    const fullDiv = sortDivisionNurses(teamNurses, srcDiv);
    const merged = mergeWorkerOrderIntoFullOrder(fullDiv, reordered);
    const midx = merged.findIndex((n) => n.nurseId === nurseId);

    if (midx === -1) return null;

    return finalizePayload(merged, midx, nurseId, shiftTeamId, dstDiv);
}
