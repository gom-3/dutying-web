import type {TWardShiftsDTO} from '@dutying/api/ward';
import type {TShift, TWardShiftType} from '@/entities';
import type {TCellValue, TDutyDoc, TWorkKeyMap} from './types';

type TWardShiftTypeMaps = {
    idToType: Map<number, TWardShiftType>;
    shortNameToType: Map<string, TWardShiftType>;
};

function formatDateKey(year: number, month: number, day: number): string {
    const yyyy = String(year);
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

export function buildWardShiftTypeMaps(shift: TShift): TWardShiftTypeMaps {
    const idToType = new Map<number, TWardShiftType>();
    const shortNameToType = new Map<string, TWardShiftType>();

    for (const t of shift.wardShiftTypes) {
        idToType.set(t.wardShiftTypeId, t);
        shortNameToType.set(t.shortName, t);
    }

    return {idToType, shortNameToType};
}

/**
 * API가 근무 배정이 없어도 날짜/골격만 채운 `TShift`를 줄 때가 있어,
 * /duty 등에서 "근무표 없음"으로 취급할 때 사용한다.
 */
export function isDutyShiftWithoutAssignments(shift: TShift): boolean {
    if (!shift.days?.length) return true;

    const divisions = shift.divisionShiftNurses ?? [];

    for (const division of divisions) {
        for (const row of division) {
            if (!row.shiftNurse.isWorker) continue;

            for (const cell of row.wardShiftList ?? []) {
                if (cell != null) return false;
            }
        }
    }

    return true;
}

/** 모든 근무자(worker) 행의 날짜별 칸이 비어 있지 않을 때 true (골격만 있는 응답 / 미배정 칸이 하나라도 있으면 false). */
export function isDutyShiftFullyAssigned(shift: TShift): boolean {
    if (!shift.days?.length) return false;

    const dayCount = shift.days.length;
    const divisions = shift.divisionShiftNurses ?? [];
    let seenWorker = false;

    for (const division of divisions) {
        for (const row of division) {
            if (!row.shiftNurse.isWorker) continue;

            seenWorker = true;
            const list = row.wardShiftList ?? [];

            for (let j = 0; j < dayCount; j += 1) {
                if (list[j] == null) return false;
            }
        }
    }

    return seenWorker;
}

export function shiftToDoc(shift: TShift, year: number, month: number): TDutyDoc {
    const {idToType} = buildWardShiftTypeMaps(shift);
    const columns = shift.days.map((d) => formatDateKey(year, month, d.day));
    const workerMeta: TDutyDoc['workerMeta'] = {};
    const rows = shift.divisionShiftNurses
        .flatMap((division) => division)
        .filter((row) => row.shiftNurse.isWorker)
        .map((row) => {
            const workerId = String(row.shiftNurse.shiftNurseId);
            const cells = row.wardShiftList.map((value) => {
                if (value === null) return null;

                const type = idToType.get(value);

                return type?.shortName ?? null;
            });

            workerMeta[workerId] = {name: row.shiftNurse.name, nurseId: row.shiftNurse.nurseId};

            return {workerId, cells};
        });

    return {columns, rows, workerMeta, fixedCells: {}, requestCells: {}};
}

function cellToWardShiftTypeId(cell: TCellValue, maps: TWardShiftTypeMaps): number | null {
    if (cell === null || cell === '') return null;

    const type = maps.shortNameToType.get(cell);

    return type?.wardShiftTypeId ?? null;
}

export function docToShift(doc: TDutyDoc, originalShift: TShift): TShift {
    const maps = buildWardShiftTypeMaps(originalShift);
    const rowMap = new Map(doc.rows.map((row) => [row.workerId, row]));
    const nextDivisionShiftNurses = originalShift.divisionShiftNurses.map((division) =>
        division.map((row) => {
            if (!row.shiftNurse.isWorker) return row;

            const docRow = rowMap.get(String(row.shiftNurse.shiftNurseId));

            if (!docRow) return row;

            const nextWardShiftList = row.wardShiftList.map((_current, index) => {
                const cell = docRow.cells[index] ?? null;
                const nextId = cellToWardShiftTypeId(cell, maps);

                return nextId ?? null;
            });

            return {...row, wardShiftList: nextWardShiftList};
        }),
    );

    return {...originalShift, divisionShiftNurses: nextDivisionShiftNurses};
}

export function docToWardShiftsDTO(doc: TDutyDoc, originalShift: TShift): TWardShiftsDTO {
    const maps = buildWardShiftTypeMaps(originalShift);
    const dto: TWardShiftsDTO = [];

    for (const row of doc.rows) {
        const shiftNurseId = Number(row.workerId);

        for (let colIdx = 0; colIdx < doc.columns.length; colIdx += 1) {
            const date = doc.columns[colIdx]!;
            const cell = row.cells[colIdx] ?? null;
            const wardShiftTypeId = cellToWardShiftTypeId(cell, maps);

            dto.push({shiftNurseId, date, wardShiftTypeId});
        }
    }

    return dto;
}

export function buildWorkKeyMap(shift?: TShift): TWorkKeyMap {
    if (!shift) return {};

    return shift.wardShiftTypes.reduce<TWorkKeyMap>((acc, shiftType) => {
        if (shiftType.shortName.length !== 1) return acc;

        const key = shiftType.shortName.toLowerCase();

        if (acc[key] !== undefined) return acc;

        acc[key] = shiftType.shortName;

        return acc;
    }, {});
}
