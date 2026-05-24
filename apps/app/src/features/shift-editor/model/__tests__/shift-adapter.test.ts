import {describe, expect, it} from 'vitest';
import type {TShift} from '@/entities';
import {buildWorkKeyMap, docToShift, docToWardShiftsDTO, isDutyShiftFullyAssigned, isDutyShiftWithoutAssignments, shiftToDoc} from '../shift-adapter';

function createShift(): TShift {
    return {
        lastDays: [],
        days: [
            {day: 1, dayType: 'workday'},
            {day: 2, dayType: 'workday'},
        ],
        wardShiftTypes: [
            {
                wardShiftTypeId: 10,
                name: 'Day',
                shortName: 'D',
                startTime: '07:00',
                endTime: '15:00',
                color: '#fff',
                isDefault: true,
                isOff: false,
                isCounted: true,
                classification: 'DAY',
            },
            {
                wardShiftTypeId: 20,
                name: 'Off',
                shortName: 'O',
                startTime: '00:00',
                endTime: '00:00',
                color: '#000',
                isDefault: true,
                isOff: true,
                isCounted: false,
                classification: 'OFF',
            },
            {
                wardShiftTypeId: 30,
                name: 'Training',
                shortName: 'TR',
                startTime: '09:00',
                endTime: '18:00',
                color: '#ccc',
                isDefault: false,
                isOff: false,
                isCounted: false,
                classification: 'OTHER_WORK',
            },
        ],
        divisionShiftNurses: [
            [
                {
                    shiftNurse: {
                        shiftNurseId: 1,
                        name: 'Kim',
                        carried: 0,
                        divisionNum: 0,
                        priority: 0,
                        isWorker: true,
                        nurseId: 100,
                    },
                    lastWardShiftList: [],
                    lastWardReqShiftList: [],
                    wardShiftList: [10, null],
                    wardReqShiftList: [],
                },
                {
                    shiftNurse: {
                        shiftNurseId: 2,
                        name: 'Lee',
                        carried: 0,
                        divisionNum: 0,
                        priority: 1,
                        isWorker: false as never,
                        nurseId: 101,
                    },
                    lastWardShiftList: [],
                    lastWardReqShiftList: [],
                    wardShiftList: [20, 10],
                    wardReqShiftList: [],
                },
            ],
        ],
    };
}

describe('shift-adapter', () => {
    it('detects empty shift payloads from API shape', () => {
        expect(isDutyShiftWithoutAssignments(createShift())).toBe(false);

        const noWorkers: TShift = {
            ...createShift(),
            divisionShiftNurses: [[]],
        };

        expect(isDutyShiftWithoutAssignments(noWorkers)).toBe(true);

        const onlyNullCells: TShift = {
            ...createShift(),
            divisionShiftNurses: [
                [
                    {
                        ...createShift().divisionShiftNurses[0]![0]!,
                        wardShiftList: [null, null],
                    },
                ],
            ],
        };

        expect(isDutyShiftWithoutAssignments(onlyNullCells)).toBe(true);
    });

    it('detects fully assigned worker grids', () => {
        expect(isDutyShiftFullyAssigned(createShift())).toBe(false);

        const full: TShift = {
            ...createShift(),
            divisionShiftNurses: [
                [
                    {
                        ...createShift().divisionShiftNurses[0]![0]!,
                        wardShiftList: [10, 20],
                    },
                ],
            ],
        };

        expect(isDutyShiftFullyAssigned(full)).toBe(true);

        const noWorkers: TShift = {
            ...createShift(),
            divisionShiftNurses: [[]],
        };

        expect(isDutyShiftFullyAssigned(noWorkers)).toBe(false);
    });

    it('converts only worker rows into editor doc', () => {
        const doc = shiftToDoc(createShift(), 2026, 3);

        expect(doc.columns).toEqual(['2026-03-01', '2026-03-02']);
        expect(doc.rows).toEqual([{workerId: '1', cells: ['D', null]}]);
        expect(doc.workerMeta).toEqual({1: {name: 'Kim', nurseId: 100}});
    });

    it('converts editor doc back to ward shifts dto', () => {
        const shift = createShift();
        const doc = {
            columns: ['2026-03-01', '2026-03-02'],
            rows: [{workerId: '1', cells: ['O', 'D']}],
            workerMeta: {1: {name: 'Kim'}},
            fixedCells: {},
            requestCells: {},
        };

        expect(docToWardShiftsDTO(doc, shift)).toEqual([
            {shiftNurseId: 1, date: '2026-03-01', wardShiftTypeId: 20},
            {shiftNurseId: 1, date: '2026-03-02', wardShiftTypeId: 10},
        ]);
    });

    it('builds work key map from single-character short names only', () => {
        expect(buildWorkKeyMap(createShift())).toEqual({
            d: 'D',
            o: 'O',
        });
    });

    it('projects editor doc back onto worker rows while preserving non-worker rows', () => {
        const shift = createShift();
        const doc = {
            columns: ['2026-03-01', '2026-03-02'],
            rows: [{workerId: '1', cells: ['O', 'TR']}],
            workerMeta: {1: {name: 'Kim'}},
            fixedCells: {},
            requestCells: {},
        };
        const nextShift = docToShift(doc, shift);

        expect(nextShift.divisionShiftNurses[0]?.[0]?.wardShiftList).toEqual([20, 30]);
        expect(nextShift.divisionShiftNurses[0]?.[1]?.wardShiftList).toEqual([20, 10]);
    });

    it('falls back to null when editor cells do not map to a known ward shift type', () => {
        const shift = createShift();
        const doc = {
            columns: ['2026-03-01', '2026-03-02'],
            rows: [{workerId: '1', cells: ['UNKNOWN', 'D']}],
            workerMeta: {1: {name: 'Kim'}},
            fixedCells: {},
            requestCells: {},
        };

        expect(docToWardShiftsDTO(doc, shift)).toEqual([
            {shiftNurseId: 1, date: '2026-03-01', wardShiftTypeId: null},
            {shiftNurseId: 1, date: '2026-03-02', wardShiftTypeId: 10},
        ]);
    });
});
